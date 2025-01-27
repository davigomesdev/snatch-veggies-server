import { TVector2 } from '@core/types/vector2.type';
import { TBlockSetter } from '@core/types/block-setter';

import { ChildrenTypeEnum } from '@core/enums/children-type.enum';

import { WsNotFoundError } from '@domain/ws-errors/ws-not-found-error';

import { JsonFileService } from '@infrastructure/json-file/json-file.service';

import { IUseCase } from '@application/usecases/use-case.interface';

import { LandRepository } from '@modules/land/domain/land.repository';
import { StructRepository } from '@modules/struct/domain/struct.repository';
import { StructInventoryRepository } from '@modules/struct-inventory/domain/struct-inventory.repository';

export namespace DeleteStructBlockLandUseCase {
  export type Input = {
    id: string;
    userId: string;
    blockPos: TVector2;
  };

  export type Output = void;

  export class UseCase implements IUseCase<Input, Output> {
    public constructor(
      private readonly landRepository: LandRepository.Repository,
      private readonly structRepository: StructRepository.Repository,
      private readonly structInventoryRepository: StructInventoryRepository.Repository,
      private readonly jsonFileService: JsonFileService,
    ) {}

    public async execute(input: Input): Promise<Output> {
      const { id, userId, blockPos } = input;

      const land = await this.landRepository.find({
        id,
        userId,
      });

      const blocks = this.jsonFileService.getFile(land.tokenId.toString());
      const blockSetter = blocks[blockPos.y][blockPos.x];

      if (blockSetter.children === null || blockSetter.children.type !== ChildrenTypeEnum.STRUCT) {
        throw new WsNotFoundError('Struct not found.');
      }

      const struct = await this.structRepository.find({
        index: blockSetter.children.id,
      });

      const structInventory = await this.structInventoryRepository.find({
        landId: land.id,
        structId: struct.id,
      });

      structInventory.updateInUse(structInventory.inUse - 1);
      const adjacentBlocks = this.getAdjacentBlocks(blocks, blockPos, struct.size);

      adjacentBlocks.map((block) => {
        if (block) blocks[block.y][block.x].occupied = false;
      });

      blockSetter.occupied = false;
      blockSetter.children = null;

      blocks[blockPos.y][blockPos.x] = blockSetter;

      this.jsonFileService.updateFile(land.tokenId.toString(), blocks);
      await this.structInventoryRepository.update(structInventory);
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
