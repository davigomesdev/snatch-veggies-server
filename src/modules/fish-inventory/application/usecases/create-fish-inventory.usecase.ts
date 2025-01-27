import { BadRequestError } from '@domain/errors/bad-request-error';

import { IUseCase } from '@application/usecases/use-case.interface';

import { UserRepository } from '@modules/user/domain/user.repository';

import { FishEntity } from '@modules/fish/domain/fish.entity';
import { FishRepository } from '@modules/fish/domain/fish.repository';

import { FishInventoryEntity } from '@modules/fish-inventory/domain/fish-inventory.entity';
import { FishInventoryRepository } from '@modules/fish-inventory/domain/fish-inventory.repository';
import { FishInventoryOutput, FishInventoryOutputMapper } from '../output/fish-inventory.output';
import { LandRepository } from '@modules/land/domain/land.repository';

export namespace CreateFishInventoryUseCase {
  export type Input = {
    userId: string;
    landId: string;
  };

  export type Output = FishInventoryOutput;

  export class UseCase implements IUseCase<Input, Output> {
    public constructor(
      private readonly fishInventoryRepository: FishInventoryRepository.Repository,
      private readonly userRepository: UserRepository.Repository,
      private readonly landRepository: LandRepository.Repository,
      private readonly fishRepository: FishRepository.Repository,
    ) {}

    public async execute(input: Input): Promise<Output> {
      const { userId, landId } = input;

      const userEntity = await this.userRepository.find({ id: userId });
      const landEntity = await this.landRepository.find({ id: landId, userId });

      const fishEntities = await this.fishRepository.findAll();
      const fishEntity = this.classify(fishEntities);

      const totalPayable = 100;

      if (totalPayable > userEntity.gold) {
        throw new BadRequestError('Insufficient coin.');
      }

      userEntity.updateGold(userEntity.gold - totalPayable);

      let fishInventory: FishInventoryEntity;
      const isExists = await this.fishInventoryRepository.isExists(landEntity.id, fishEntity.id);

      if (isExists) {
        const entity = await this.fishInventoryRepository.find({
          landId: landEntity.id,
          fishId: fishEntity.id,
        });

        entity.updateAmount(entity.amount + 1);
        fishInventory = await this.fishInventoryRepository.update(entity);
      } else {
        const entity = new FishInventoryEntity({
          landId: landEntity.id,
          fishId: fishEntity.id,
          amount: 1,
        });

        fishInventory = await this.fishInventoryRepository.create(entity);
      }

      fishInventory.addEntity(fishEntity);
      await this.userRepository.update(userEntity);

      return FishInventoryOutputMapper.toOutput(fishInventory);
    }

    private classify(fishes: FishEntity[]): FishEntity {
      if (!fishes.length) {
        throw new BadRequestError('The fish list is empty.');
      }

      const totalWeight = fishes.reduce((sum, fish) => sum + fish.rarity, 0);

      const random = Math.random() * totalWeight;

      let currentWeight = 0;

      for (const fish of fishes) {
        currentWeight += fish.rarity;
        if (random <= currentWeight) {
          return fish;
        }
      }

      return fishes[fishes.length - 1];
    }
  }
}
