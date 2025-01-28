import { TVector2 } from '@core/types/vector2.type';

import { WsBadRequestError } from '@domain/ws-errors/ws-bad-request-error';

import { JsonFileService } from '@infrastructure/json-file/json-file.service';

import { IUseCase } from '@application/usecases/use-case.interface';

import { LandRepository } from '@modules/land/domain/land.repository';
import { BlockRepository } from '@modules/block/domain/block.repository';

import { BlockInventoryRepository } from '@modules/block-inventory/domain/block-inventory.repository';
import {
  BlockInventoryOutput,
  BlockInventoryOutputMapper,
} from '@modules/block-inventory/application/output/block-inventory.output';

export namespace CreateBlockLandUseCase {
  export type Input = {
    id: string;
    userId: string;
    blockPos: TVector2;
    blockIndex: number;
  };

  export type Output = {
    newBlockInventory: BlockInventoryOutput;
    oldBlockInventory: BlockInventoryOutput;
  };

  export class UseCase implements IUseCase<Input, Output> {
    public constructor(
      private readonly landRepository: LandRepository.Repository,
      private readonly blockRepository: BlockRepository.Repository,
      private readonly blockInventoryRepository: BlockInventoryRepository.Repository,
      private readonly jsonFileService: JsonFileService,
    ) {}

    public async execute(input: Input): Promise<Output> {
      const { id, userId, blockPos, blockIndex } = input;

      const land = await this.landRepository.find({
        id,
        userId,
      });

      const blocks = this.jsonFileService.getFile(land.tokenId.toString());
      const blockSetter = blocks[blockPos.y][blockPos.x];

      if (blockSetter.children !== null) {
        throw new WsBadRequestError('Busy block.');
      }

      const oldBlock = await this.blockRepository.find({
        index: blockSetter.id,
      });

      const newBlock = await this.blockRepository.find({
        index: blockIndex,
      });

      if (oldBlock.id === newBlock.id) {
        throw new WsBadRequestError('You are wanting to exchange the same block.');
      }

      const oldBlockInventoryEntity = await this.blockInventoryRepository.find({
        landId: land.id,
        blockId: oldBlock.id,
      });

      const newBlockInventoryEntity = await this.blockInventoryRepository.find({
        landId: land.id,
        blockId: newBlock.id,
      });

      oldBlockInventoryEntity.updateInUse(oldBlockInventoryEntity.inUse - 1);
      newBlockInventoryEntity.updateInUse(newBlockInventoryEntity.inUse + 1);

      if (newBlockInventoryEntity.inUse > newBlockInventoryEntity.amount) {
        throw new WsBadRequestError('Insufficient amount.');
      }

      blocks[blockPos.y][blockPos.x] = {
        id: blockIndex,
        occupied: false,
        children: null,
      };

      const newBlockInventory = await this.blockInventoryRepository.update(newBlockInventoryEntity);
      const oldBlockInventory = await this.blockInventoryRepository.update(oldBlockInventoryEntity);

      this.jsonFileService.updateFile(land.tokenId.toString(), blocks);

      return {
        newBlockInventory: BlockInventoryOutputMapper.toOutput(newBlockInventory),
        oldBlockInventory: BlockInventoryOutputMapper.toOutput(oldBlockInventory),
      };
    }
  }
}
