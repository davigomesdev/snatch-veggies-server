import { differenceInMinutes } from 'date-fns';

import { TVector2 } from '@core/types/vector2.type';

import { ChildrenTypeEnum } from '@core/enums/children-type.enum';

import { WsBadRequestError } from '@domain/ws-errors/ws-bad-request-error';

import { JsonFileService } from '@infrastructure/json-file/json-file.service';

import { IUseCase } from '@application/usecases/use-case.interface';

import { LandRepository } from '@modules/land/domain/land.repository';
import { PlantRepository } from '@modules/plant/domain/plant.repository';
import { PlantInventoryRepository } from '@modules/plant-inventory/domain/plant-inventory.repository';

export namespace HarvestPlantBlockLandUseCase {
  export type Input = {
    id: string;
    userId: string;
    blockPos: TVector2;
  };

  export type Output = void;

  export class UseCase implements IUseCase<Input, Output> {
    public constructor(
      private readonly landRepository: LandRepository.Repository,
      private readonly plantRepository: PlantRepository.Repository,
      private readonly plantInventoryRepository: PlantInventoryRepository.Repository,
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

      if (blockSetter.children === null || blockSetter.children.type !== ChildrenTypeEnum.SEED) {
        throw new WsBadRequestError('Invalid block.');
      }

      const plant = await this.plantRepository.find({
        index: blockSetter.children.id,
      });

      const plantInventory = await this.plantInventoryRepository.find({
        landId: land.id,
        plantId: plant.id,
      });

      const minutesElapsed = differenceInMinutes(new Date(), blockSetter.children.updateAt);

      if (minutesElapsed < plant.duration) {
        throw new WsBadRequestError(`It's not harvest time yet.`);
      }

      land.updateExp(land.exp + plant.exp);
      plantInventory
        .updateHarvest(plantInventory.harvest + 1)
        .updateAmount(plantInventory.amount - 1)
        .updateInUse(plantInventory.inUse - 1);

      blockSetter.occupied = false;
      blockSetter.children = null;

      blocks[blockPos.y][blockPos.x] = blockSetter;

      this.jsonFileService.updateFile(land.tokenId.toString(), blocks);

      await this.plantInventoryRepository.update(plantInventory);
      await this.landRepository.update(land);
    }
  }
}
