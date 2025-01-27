import { BadRequestError } from '@domain/errors/bad-request-error';

import { IUseCase } from '@application/usecases/use-case.interface';

import { UserRepository } from '@modules/user/domain/user.repository';
import { LandRepository } from '@modules/land/domain/land.repository';

import { PlantInventoryRepository } from '@modules/plant-inventory/domain/plant-inventory.repository';
import { PlantInventoryOutput, PlantInventoryOutputMapper } from '../output/plant-inventory.output';

export namespace SalePlantInventoryUseCase {
  export type Input = {
    id: string;
    userId: string;
    landId: string;
    amount: number;
  };

  export type Output = PlantInventoryOutput;

  export class UseCase implements IUseCase<Input, Output> {
    public constructor(
      private readonly plantInventoryRepository: PlantInventoryRepository.Repository,
      private readonly userRepository: UserRepository.Repository,
      private readonly landRepository: LandRepository.Repository,
    ) {}

    public async execute(input: Input): Promise<Output> {
      const { id, userId, landId, amount } = input;

      const userEntity = await this.userRepository.find({
        id: userId,
      });

      const landEntity = await this.landRepository.find({
        id: landId,
        userId,
      });

      const plantInventoryEntity = await this.plantInventoryRepository.find({
        id,
        landId: landEntity.id,
        plant: true,
      });

      const plantEntity = plantInventoryEntity.getEntity('plant');

      if (amount > plantInventoryEntity.harvest) {
        throw new BadRequestError('Insufficient amount.');
      }

      const totalPayable = amount * plantEntity.profit;

      userEntity.updateGold(userEntity.gold + totalPayable);
      plantInventoryEntity.updateHarvest(plantInventoryEntity.harvest - amount);

      await this.userRepository.update(userEntity);
      const plantInventory = await this.plantInventoryRepository.update(plantInventoryEntity);

      return PlantInventoryOutputMapper.toOutput(plantInventory);
    }
  }
}
