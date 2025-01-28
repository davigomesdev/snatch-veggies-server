import { TVector2 } from '@core/types/vector2.type';
import { TBlockSetter } from '@core/types/block-setter';

import { BlockTypeEnum } from '@core/enums/block-type.enum';
import { ChildrenTypeEnum } from '@core/enums/children-type.enum';

import { WsBadRequestError } from '@domain/ws-errors/ws-bad-request-error';

import { JsonFileService } from '@infrastructure/json-file/json-file.service';

import { IUseCase } from '@application/usecases/use-case.interface';

import { LandRepository } from '@modules/land/domain/land.repository';
import { BlockRepository } from '@modules/block/domain/block.repository';
import { DecorationRepository } from '@modules/decoration/domain/decoration.repository';

import { DecorationInventoryRepository } from '@modules/decoration-inventory/domain/decoration-inventory.repository';
import {
  DecorationInventoryOutput,
  DecorationInventoryOutputMapper,
} from '@modules/decoration-inventory/application/output/decoration-inventory.output';

export namespace CreateDecorationBlockLandUseCase {
  export type Input = {
    id: string;
    userId: string;
    blockPos: TVector2;
    decorationIndex: number;
  };

  export type Output = DecorationInventoryOutput;

  export class UseCase implements IUseCase<Input, Output> {
    public constructor(
      private readonly landRepository: LandRepository.Repository,
      private readonly blockRepository: BlockRepository.Repository,
      private readonly decorationRepository: DecorationRepository.Repository,
      private readonly decorationInventoryRepository: DecorationInventoryRepository.Repository,
      private readonly jsonFileService: JsonFileService,
    ) {}

    public async execute(input: Input): Promise<Output> {
      const { id, userId, blockPos, decorationIndex } = input;

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

      const decoration = await this.decorationRepository.find({
        index: decorationIndex,
      });

      const decorationInventoryEntity = await this.decorationInventoryRepository.find({
        landId: land.id,
        decorationId: decoration.id,
      });

      decorationInventoryEntity.updateInUse(decorationInventoryEntity.inUse + 1);

      if (decorationInventoryEntity.inUse > decorationInventoryEntity.amount) {
        throw new WsBadRequestError('Insufficient amount.');
      }

      const adjacentBlocks = this.getAdjacentBlocks(blocks, blockPos, decoration.size);
      await this.validateAdjacentBlocks(adjacentBlocks);

      adjacentBlocks.map((block) => {
        if (block) blocks[block.y][block.x].occupied = true;
      });

      blockSetter.occupied = true;
      blockSetter.children = {
        id: decoration.index,
        type: ChildrenTypeEnum.DECORATION,
      };

      blocks[blockPos.y][blockPos.x] = blockSetter;

      const decorationInventory =
        await this.decorationInventoryRepository.update(decorationInventoryEntity);
      this.jsonFileService.updateFile(land.tokenId.toString(), blocks);

      return DecorationInventoryOutputMapper.toOutput(decorationInventory);
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
