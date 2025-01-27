import { TVector2 } from '@core/types/vector2.type';
import { TBlockSetter } from '@core/types/block-setter';

import { BlockTypeEnum } from '@core/enums/block-type.enum';
import { ChildrenTypeEnum } from '@core/enums/children-type.enum';

import { WsBadRequestError } from '@domain/ws-errors/ws-bad-request-error';

import { JsonFileService } from '@infrastructure/json-file/json-file.service';

import { IUseCase } from '@application/usecases/use-case.interface';

import { LandRepository } from '@modules/land/domain/land.repository';
import { BlockRepository } from '@modules/block/domain/block.repository';
import { StructRepository } from '@modules/struct/domain/struct.repository';
import { StructInventoryRepository } from '@modules/struct-inventory/domain/struct-inventory.repository';

export namespace CreateStructBlockLandUseCase {
  export type Input = {
    id: string;
    userId: string;
    blockPos: TVector2;
    structIndex: number;
  };

  export type Output = void;

  export class UseCase implements IUseCase<Input, Output> {
    public constructor(
      private readonly landRepository: LandRepository.Repository,
      private readonly blockRepository: BlockRepository.Repository,
      private readonly structRepository: StructRepository.Repository,
      private readonly structInventoryRepository: StructInventoryRepository.Repository,
      private readonly jsonFileService: JsonFileService,
    ) {}

    public async execute(input: Input): Promise<Output> {
      const { id, userId, blockPos, structIndex } = input;

      const land = await this.landRepository.find({
        id,
        userId,
      });

      const blocks = this.jsonFileService.getFile(land.tokenId.toString());
      const blockSetter = blocks[blockPos.y][blockPos.x];

      if (blockSetter.children !== null) {
        throw new WsBadRequestError('Busy block.');
      }

      const block = await this.blockRepository.find({
        index: blockSetter.id,
      });

      if (block.type !== BlockTypeEnum.SOLID) {
        throw new WsBadRequestError('Invalid block.');
      }

      const struct = await this.structRepository.find({
        index: structIndex,
      });

      const structInventory = await this.structInventoryRepository.find({
        landId: land.id,
        structId: struct.id,
      });

      structInventory.updateInUse(structInventory.inUse + 1);

      if (structInventory.inUse > structInventory.amount) {
        throw new WsBadRequestError('Insufficient amount.');
      }

      const adjacentBlocks = this.getAdjacentBlocks(blocks, blockPos, struct.size);
      await this.validateAdjacentBlocks(adjacentBlocks);

      adjacentBlocks.map((block) => {
        if (block) blocks[block.y][block.x].occupied = true;
      });

      blockSetter.occupied = true;
      blockSetter.children = {
        id: struct.index,
        type: ChildrenTypeEnum.STRUCT,
        updateAt: new Date(),
      };

      blocks[blockPos.y][blockPos.x] = blockSetter;

      await this.structInventoryRepository.update(structInventory);
      this.jsonFileService.updateFile(land.tokenId.toString(), blocks);
    }

    private async validateAdjacentBlocks(
      adjacentBlocks: ((TBlockSetter & TVector2) | null)[],
    ): Promise<void> {
      const blockValidations = adjacentBlocks.map(async (blockSetter) => {
        if (!blockSetter) {
          throw new WsBadRequestError('Invalid block position.');
        }

        if (blockSetter.occupied) {
          throw new WsBadRequestError('Block is already occupied.');
        }

        const block = await this.blockRepository.find({
          index: blockSetter.id,
        });

        if (block.type !== BlockTypeEnum.SOLID) {
          throw new WsBadRequestError('Block must be of type SOLID.');
        }
      });

      await Promise.all(blockValidations);
    }

    private getAdjacentBlocks(
      blocks: TBlockSetter[][],
      position: TVector2,
      size: TVector2,
    ): ((TBlockSetter & TVector2) | null)[] {
      const adjacentBlocks: ((TBlockSetter & TVector2) | null)[] = [];

      for (let dx = -Math.floor(size.x / 2); dx <= Math.floor(size.x / 2); dx++) {
        for (let dy = -Math.floor(size.y / 2); dy <= Math.floor(size.y / 2); dy++) {
          const neighborX = position.x + dx;
          const neighborY = position.y + dy;

          const block = blocks[neighborY]?.[neighborX];
          adjacentBlocks.push(block ? { ...block, x: neighborX, y: neighborY } : null);
        }
      }

      return adjacentBlocks;
    }
  }
}
