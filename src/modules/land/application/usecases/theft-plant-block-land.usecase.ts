import { calculateMaxQuantity } from '@core/utils/level.util';
import { differenceInMinutes, isToday } from 'date-fns';

import { TVector2 } from '@core/types/vector2.type';

import { ChildrenTypeEnum } from '@core/enums/children-type.enum';

import { WsBadRequestError } from '@domain/ws-errors/ws-bad-request-error';

import { JsonFileService } from '@infrastructure/json-file/json-file.service';

import { IUseCase } from '@application/usecases/use-case.interface';

import { LandRepository } from '@modules/land/domain/land.repository';
import { PlantRepository } from '@modules/plant/domain/plant.repository';

import { PlantInventoryEntity } from '@modules/plant-inventory/domain/plant-inventory.entity';
import { PlantInventoryRepository } from '@modules/plant-inventory/domain/plant-inventory.repository';
import {
  PlantInventoryOutput,
  PlantInventoryOutputMapper,
} from '@modules/plant-inventory/application/output/plant-inventory.output';

export namespace TheftPlantBlockLandUseCase {
  export type Input = {
    id: string;
    userId: string;
    landId: string;
    blockPos: TVector2;
  };

  export type Output = PlantInventoryOutput;

  export class UseCase implements IUseCase<Input, Output> {
    public constructor(
      private readonly landRepository: LandRepository.Repository,
      private readonly plantRepository: PlantRepository.Repository,
      private readonly plantInventoryRepository: PlantInventoryRepository.Repository,
      private readonly jsonFileService: JsonFileService,
    ) {}

    public async execute(input: Input): Promise<Output> {
      const { id, landId, userId, blockPos } = input;

      const land = await this.landRepository.find({
        id,
        userId,
      });

      const maxStolenQuantity = 5;
      const maxTheftQuantity = calculateMaxQuantity(5, land.exp);

      if (isToday(land.lastTheftDate) && land.theftCount >= maxTheftQuantity) {
        throw new WsBadRequestError('You have already reached your daily theft limit.');
      }

      const theftLand = await this.landRepository.find({
        id: landId,
      });

      if (userId === theftLand.userId) {
        throw new WsBadRequestError(`You can't theft your land.`);
      }

      if (isToday(land.lastStolenDate) && theftLand.stolenCount >= maxStolenQuantity) {
        throw new WsBadRequestError('This island will not be robbed again today.');
      }

      const blocks = this.jsonFileService.getFile(theftLand.tokenId.toString());
      const blockSetter = blocks[blockPos.y][blockPos.x];

      if (blockSetter.children === null || blockSetter.children.type !== ChildrenTypeEnum.SEED) {
        throw new WsBadRequestError('Invalid block.');
      }

      const plant = await this.plantRepository.find({
        index: blockSetter.children.id,
      });

      let plantInventoryEntity: PlantInventoryEntity;
      const isExists = await this.plantInventoryRepository.isExists(land.id, plant.id);

      if (isExists) {
        plantInventoryEntity = await this.plantInventoryRepository.find({
          landId: land.id,
          plantId: plant.id,
        });
      } else {
        const entity = new PlantInventoryEntity({
          landId: land.id,
          plantId: plant.id,
          amount: 0,
          inUse: 0,
          harvest: 0,
        });

        plantInventoryEntity = await this.plantInventoryRepository.create(entity);
      }

      const theftPlantInventory = await this.plantInventoryRepository.find({
        landId: theftLand.id,
        plantId: plant.id,
      });

      const minutesElapsed = differenceInMinutes(new Date(), blockSetter.children.updateAt);

      if (minutesElapsed < plant.duration) {
        throw new WsBadRequestError(`It's not harvest time yet.`);
      }

      if (!isToday(theftLand.lastStolenDate)) {
        theftLand.updateStolenCount(1).updateLastStolenDate(new Date());
      } else if (theftLand.stolenCount < maxStolenQuantity) {
        theftLand.updateStolenCount(theftLand.stolenCount + 1).updateLastStolenDate(new Date());
      } else {
        throw new WsBadRequestError('The land has already reached the limit of thefts.');
      }

      if (!isToday(land.lastTheftDate)) {
        land.updateTheftCount(1).updateLastTheftDate(new Date());
      } else if (land.theftCount < maxTheftQuantity) {
        land.updateTheftCount(land.theftCount + 1).updateLastTheftDate(new Date());
      } else {
        throw new WsBadRequestError('You have already reached your daily theft limit.');
      }

      land.updateExp(land.exp + plant.exp);

      plantInventoryEntity.updateHarvest(plantInventoryEntity.harvest + 1);
      theftPlantInventory
        .updateAmount(theftPlantInventory.amount - 1)
        .updateInUse(theftPlantInventory.inUse - 1);

      blockSetter.occupied = false;
      blockSetter.children = null;

      blocks[blockPos.y][blockPos.x] = blockSetter;

      this.jsonFileService.updateFile(theftLand.tokenId.toString(), blocks);

      const plantInventory = await this.plantInventoryRepository.update(plantInventoryEntity);
      await this.plantInventoryRepository.update(theftPlantInventory);
      await this.landRepository.update(theftLand);
      await this.landRepository.update(land);

      return PlantInventoryOutputMapper.toOutput(plantInventory);
    }
  }
}
