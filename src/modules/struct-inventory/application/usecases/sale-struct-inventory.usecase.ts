import { BadRequestError } from '@domain/errors/bad-request-error';

import { IUseCase } from '@application/usecases/use-case.interface';

import { UserRepository } from '@modules/user/domain/user.repository';
import { LandRepository } from '@modules/land/domain/land.repository';

import { StructInventoryRepository } from '@modules/struct-inventory/domain/struct-inventory.repository';
import {
  StructInventoryOutput,
  StructInventoryOutputMapper,
} from '../output/struct-inventory.output';

export namespace SaleStructInventoryUseCase {
  export type Input = {
    id: string;
    userId: string;
    landId: string;
    amount: number;
  };

  export type Output = StructInventoryOutput;

  export class UseCase implements IUseCase<Input, Output> {
    public constructor(
      private readonly structInventoryRepository: StructInventoryRepository.Repository,
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

      const structInventoryEntity = await this.structInventoryRepository.find({
        id,
        landId: landEntity.id,
        struct: true,
      });

      const structEntity = structInventoryEntity.getEntity('struct');

      if (amount > structInventoryEntity.minted) {
        throw new BadRequestError('Insufficient amount.');
      }

      const totalPayable = amount * structEntity.profit;

      userEntity.updateGold(userEntity.gold + totalPayable);
      structInventoryEntity.updateMinted(structInventoryEntity.minted - amount);

      await this.userRepository.update(userEntity);
      const structInventory = await this.structInventoryRepository.update(structInventoryEntity);

      return StructInventoryOutputMapper.toOutput(structInventory);
    }
  }
}
