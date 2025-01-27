import { calculateMaxQuantity } from '@core/utils/level.util';

import { BadRequestError } from '@domain/errors/bad-request-error';

import { IUseCase } from '@application/usecases/use-case.interface';

import { UserRepository } from '@modules/user/domain/user.repository';
import { LandRepository } from '@modules/land/domain/land.repository';
import { DecorationRepository } from '@modules/decoration/domain/decoration.repository';

import { DecorationInventoryEntity } from '@modules/decoration-inventory/domain/decoration-inventory.entity';
import { DecorationInventoryRepository } from '@modules/decoration-inventory/domain/decoration-inventory.repository';
import {
  DecorationInventoryOutput,
  DecorationInventoryOutputMapper,
} from '../output/decoration-inventory.output';

export namespace CreateDecorationInventoryUseCase {
  export type Input = {
    userId: string;
    landId: string;
    decorationId: string;
    amount: number;
  };

  export type Output = DecorationInventoryOutput;

  export class UseCase implements IUseCase<Input, Output> {
    public constructor(
      private readonly decorationInventoryRepository: DecorationInventoryRepository.Repository,
      private readonly userRepository: UserRepository.Repository,
      private readonly landRepository: LandRepository.Repository,
      private readonly decorationRepository: DecorationRepository.Repository,
    ) {}

    public async execute(input: Input): Promise<Output> {
      const { landId, userId, decorationId, amount } = input;

      const userEntity = await this.userRepository.find({ id: userId });
      const landEntity = await this.landRepository.find({ id: landId, userId });
      const decorationEntity = await this.decorationRepository.find({ id: decorationId });

      const maxQuantity = calculateMaxQuantity(decorationEntity.limit, landEntity.exp);

      if (amount > maxQuantity) {
        throw new BadRequestError('Insufficient level.');
      }

      const totalPayable = amount * decorationEntity.price;

      if (totalPayable > userEntity.gold) {
        throw new BadRequestError('Insufficient coin.');
      }

      userEntity.updateGold(userEntity.gold - totalPayable);

      let decorationInventory: DecorationInventoryEntity;
      const isExists = await this.decorationInventoryRepository.isExists(landId, decorationId);

      if (isExists) {
        const entity = await this.decorationInventoryRepository.find({
          landId,
          decorationId,
        });

        const totalAmount = entity.amount + amount;

        if (totalAmount > maxQuantity) {
          throw new BadRequestError('Insufficient level.');
        }

        entity.updateAmount(totalAmount);
        decorationInventory = await this.decorationInventoryRepository.update(entity);
      } else {
        const entity = new DecorationInventoryEntity({
          landId,
          decorationId,
          amount,
          inUse: 0,
        });

        decorationInventory = await this.decorationInventoryRepository.create(entity);
      }

      await this.userRepository.update(userEntity);

      return DecorationInventoryOutputMapper.toOutput(decorationInventory);
    }
  }
}
