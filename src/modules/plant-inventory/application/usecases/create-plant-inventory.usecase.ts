import { BadRequestError } from '@domain/errors/bad-request-error';

import { IUseCase } from '@application/usecases/use-case.interface';

import { UserRepository } from '@modules/user/domain/user.repository';
import { LandRepository } from '@modules/land/domain/land.repository';
import { PlantRepository } from '@modules/plant/domain/plant.repository';

import { PlantInventoryEntity } from '@modules/plant-inventory/domain/plant-inventory.entity';
import { PlantInventoryRepository } from '@modules/plant-inventory/domain/plant-inventory.repository';
import { PlantInventoryOutput, PlantInventoryOutputMapper } from '../output/plant-inventory.output';

export namespace CreatePlantInventoryUseCase {
  export type Input = {
    userId: string;
    landId: string;
    plantId: string;
    amount: number;
  };

  export type Output = PlantInventoryOutput;

  export class UseCase implements IUseCase<Input, Output> {
    public constructor(
      private readonly plantInventoryRepository: PlantInventoryRepository.Repository,
      private readonly userRepository: UserRepository.Repository,
      private readonly landRepository: LandRepository.Repository,
      private readonly plantRepository: PlantRepository.Repository,
    ) {}

    public async execute(input: Input): Promise<Output> {
      const { userId, landId, plantId, amount } = input;

      const userEntity = await this.userRepository.find({ id: userId });
      const landEntity = await this.landRepository.find({ id: landId, userId });
      const plantEntity = await this.plantRepository.find({ id: plantId });

      const totalPayable = amount * plantEntity.price;

      if (totalPayable > userEntity.gold) {
        throw new BadRequestError('Insufficient coin.');
      }

      userEntity.updateGold(userEntity.gold - totalPayable);

      let plantInventory: PlantInventoryEntity;
      const isExists = await this.plantInventoryRepository.isExists(landEntity.id, plantId);

      if (isExists) {
        const entity = await this.plantInventoryRepository.find({
          landId: landEntity.id,
          plantId,
        });

        entity.updateAmount(entity.amount + amount);
        plantInventory = await this.plantInventoryRepository.update(entity);
      } else {
        const entity = new PlantInventoryEntity({
          landId,
          plantId,
          amount,
          inUse: 0,
          harvest: 0,
        });

        plantInventory = await this.plantInventoryRepository.create(entity);
      }

      await this.userRepository.update(userEntity);

      return PlantInventoryOutputMapper.toOutput(plantInventory);
    }
  }
}
