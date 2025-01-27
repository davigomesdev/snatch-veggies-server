import { calculateMaxQuantity } from '@core/utils/level.util';

import { BadRequestError } from '@domain/errors/bad-request-error';

import { IUseCase } from '@application/usecases/use-case.interface';

import { UserRepository } from '@modules/user/domain/user.repository';
import { LandRepository } from '@modules/land/domain/land.repository';
import { StructRepository } from '@modules/struct/domain/struct.repository';

import { StructInventoryEntity } from '@modules/struct-inventory/domain/struct-inventory.entity';
import { StructInventoryRepository } from '@modules/struct-inventory/domain/struct-inventory.repository';
import {
  StructInventoryOutput,
  StructInventoryOutputMapper,
} from '../output/struct-inventory.output';

export namespace CreateStructInventoryUseCase {
  export type Input = {
    userId: string;
    landId: string;
    structId: string;
    amount: number;
  };

  export type Output = StructInventoryOutput;

  export class UseCase implements IUseCase<Input, Output> {
    public constructor(
      private readonly structInventoryRepository: StructInventoryRepository.Repository,
      private readonly userRepository: UserRepository.Repository,
      private readonly landRepository: LandRepository.Repository,
      private readonly structRepository: StructRepository.Repository,
    ) {}

    public async execute(input: Input): Promise<Output> {
      const { landId, userId, structId, amount } = input;

      const userEntity = await this.userRepository.find({ id: userId });
      const landEntity = await this.landRepository.find({ id: landId, userId });
      const structEntity = await this.structRepository.find({ id: structId });

      const maxQuantity = calculateMaxQuantity(structEntity.limit, landEntity.exp);

      if (amount > maxQuantity) {
        throw new BadRequestError('Insufficient level.');
      }

      const totalPayable = amount * structEntity.price;

      if (totalPayable > userEntity.gold) {
        throw new BadRequestError('Insufficient coin.');
      }

      userEntity.updateGold(userEntity.gold - totalPayable);

      let structInventory: StructInventoryEntity;
      const isExists = await this.structInventoryRepository.isExists(landId, structId);

      if (isExists) {
        const entity = await this.structInventoryRepository.find({
          landId,
          structId,
        });

        const totalAmount = entity.amount + amount;

        if (totalAmount > maxQuantity) {
          throw new BadRequestError('Insufficient level.');
        }

        entity.updateAmount(totalAmount);
        structInventory = await this.structInventoryRepository.update(entity);
      } else {
        const entity = new StructInventoryEntity({
          landId,
          structId,
          amount,
          inUse: 0,
          minted: 0,
        });

        structInventory = await this.structInventoryRepository.create(entity);
      }

      await this.userRepository.update(userEntity);

      return StructInventoryOutputMapper.toOutput(structInventory);
    }
  }
}
