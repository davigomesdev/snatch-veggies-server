import { BadRequestError } from '@domain/errors/bad-request-error';

import { IUseCase } from '@application/usecases/use-case.interface';

import { UserRepository } from '@modules/user/domain/user.repository';
import { LandRepository } from '@modules/land/domain/land.repository';

import { FishInventoryRepository } from '@modules/fish-inventory/domain/fish-inventory.repository';
import { FishInventoryOutput, FishInventoryOutputMapper } from '../output/fish-inventory.output';

export namespace SaleFishInventoryUseCase {
  export type Input = {
    id: string;
    userId: string;
    landId: string;
    amount: number;
  };

  export type Output = FishInventoryOutput;

  export class UseCase implements IUseCase<Input, Output> {
    public constructor(
      private readonly fishInventoryRepository: FishInventoryRepository.Repository,
      private readonly userRepository: UserRepository.Repository,
      private readonly landRepository: LandRepository.Repository,
    ) {}

    public async execute(input: Input): Promise<Output> {
      const { id, landId, userId, amount } = input;

      const userEntity = await this.userRepository.find({
        id: userId,
      });

      const landEntity = await this.landRepository.find({
        id: landId,
        userId,
      });

      const fishInventoryEntity = await this.fishInventoryRepository.find({
        id,
        landId: landEntity.id,
        fish: true,
      });

      const fishEntity = fishInventoryEntity.getEntity('fish');

      if (amount > fishInventoryEntity.amount) {
        throw new BadRequestError('Insufficient amount.');
      }

      const totalPayable = amount * fishEntity.price;

      userEntity.updateGold(userEntity.gold + totalPayable);
      fishInventoryEntity.updateAmount(fishInventoryEntity.amount - amount);

      await this.userRepository.update(userEntity);
      const fishInventory = await this.fishInventoryRepository.update(fishInventoryEntity);

      return FishInventoryOutputMapper.toOutput(fishInventory);
    }
  }
}
