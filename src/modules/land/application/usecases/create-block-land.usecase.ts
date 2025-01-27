import { TVector2 } from '@core/types/vector2.type';

import { WsBadRequestError } from '@domain/ws-errors/ws-bad-request-error';

import { JsonFileService } from '@infrastructure/json-file/json-file.service';

import { IUseCase } from '@application/usecases/use-case.interface';

import { LandRepository } from '@modules/land/domain/land.repository';
import { BlockRepository } from '@modules/block/domain/block.repository';
import { BlockInventoryRepository } from '@modules/block-inventory/domain/block-inventory.repository';

export namespace CreateBlockLandUseCase {
  export type Input = {
    id: string;
    userId: string;
    blockPos: TVector2;
    blockIndex: number;
  };

  export type Output = void;

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

      if (oldBlock.id === newBlock.id) return;

      const oldBlockInventory = await this.blockInventoryRepository.find({
        landId: land.id,
        blockId: oldBlock.id,
      });

      const newBlockInventory = await this.blockInventoryRepository.find({
        landId: land.id,
        blockId: newBlock.id,
      });

      oldBlockInventory.updateInUse(oldBlockInventory.inUse - 1);
      newBlockInventory.updateInUse(newBlockInventory.inUse + 1);

      if (newBlockInventory.inUse > newBlockInventory.amount) {
        throw new WsBadRequestError('Insufficient amount.');
      }

      blocks[blockPos.y][blockPos.x] = {
        id: blockIndex,
        occupied: false,
        children: null,
      };

      await this.blockInventoryRepository.update(newBlockInventory);
      await this.blockInventoryRepository.update(oldBlockInventory);

      this.jsonFileService.updateFile(land.tokenId.toString(), blocks);
    }
  }
}
