import { TVector2 } from '@core/types/vector2.type';

import { BlockTypeEnum } from '@core/enums/block-type.enum';
import { ChildrenTypeEnum } from '@core/enums/children-type.enum';

import { WsBadRequestError } from '@domain/ws-errors/ws-bad-request-error';

import { JsonFileService } from '@infrastructure/json-file/json-file.service';

import { IUseCase } from '@application/usecases/use-case.interface';

import { LandRepository } from '@modules/land/domain/land.repository';
import { BlockRepository } from '@modules/block/domain/block.repository';
import { PlantRepository } from '@modules/plant/domain/plant.repository';
import { PlantInventoryRepository } from '@modules/plant-inventory/domain/plant-inventory.repository';

export namespace CreatePlantBlockLandUseCase {
  export type Input = {
    id: string;
    userId: string;
    blockPos: TVector2;
    plantIndex: number;
  };

  export type Output = void;

  export class UseCase implements IUseCase<Input, Output> {
    public constructor(
      private readonly landRepository: LandRepository.Repository,
      private readonly blockRepository: BlockRepository.Repository,
      private readonly plantRepository: PlantRepository.Repository,
      private readonly plantInventoryRepository: PlantInventoryRepository.Repository,
      private readonly jsonFileService: JsonFileService,
    ) {}

    public async execute(input: Input): Promise<Output> {
      const { id, userId, blockPos, plantIndex } = input;

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

      if (block.type !== BlockTypeEnum.PLANTING) {
        throw new WsBadRequestError('Invalid block.');
      }

      const plant = await this.plantRepository.find({
        index: plantIndex,
      });

      const plantInventory = await this.plantInventoryRepository.find({
        landId: land.id,
        plantId: plant.id,
      });

      plantInventory.updateInUse(plantInventory.inUse + 1);

      if (plantInventory.inUse > plantInventory.amount) {
        throw new WsBadRequestError('Insufficient amount.');
      }

      blockSetter.occupied = true;
      blockSetter.children = {
        id: plant.index,
        type: ChildrenTypeEnum.SEED,
        updateAt: new Date(),
      };

      blocks[blockPos.y][blockPos.x] = blockSetter;

      await this.plantInventoryRepository.update(plantInventory);
      this.jsonFileService.updateFile(land.tokenId.toString(), blocks);
    }
  }
}
