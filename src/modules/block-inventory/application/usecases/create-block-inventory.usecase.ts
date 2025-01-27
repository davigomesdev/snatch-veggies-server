import { calculateMaxQuantity } from '@core/utils/level.util';

import { BadRequestError } from '@domain/errors/bad-request-error';

import { IUseCase } from '@application/usecases/use-case.interface';

import { UserRepository } from '@modules/user/domain/user.repository';
import { LandRepository } from '@modules/land/domain/land.repository';
import { BlockRepository } from '@modules/block/domain/block.repository';

import { BlockInventoryEntity } from '@modules/block-inventory/domain/block-inventory.entity';
import { BlockInventoryRepository } from '@modules/block-inventory/domain/block-inventory.repository';
import { BlockInventoryOutput, BlockInventoryOutputMapper } from '../output/block-inventory.output';

export namespace CreateBlockInventoryUseCase {
  export type Input = {
    userId: string;
    landId: string;
    blockId: string;
    amount: number;
  };

  export type Output = BlockInventoryOutput;

  export class UseCase implements IUseCase<Input, Output> {
    public constructor(
      private readonly blockInventoryRepository: BlockInventoryRepository.Repository,
      private readonly userRepository: UserRepository.Repository,
      private readonly landRepository: LandRepository.Repository,
      private readonly blockRepository: BlockRepository.Repository,
    ) {}

    public async execute(input: Input): Promise<Output> {
      const { userId, landId, blockId, amount } = input;

      const userEntity = await this.userRepository.find({ id: userId });
      const landEntity = await this.landRepository.find({ id: landId, userId });
      const blockEntity = await this.blockRepository.find({ id: blockId });

      const maxQuantity = calculateMaxQuantity(blockEntity.limit, landEntity.exp);

      if (amount > maxQuantity) {
        throw new BadRequestError('Insufficient level.');
      }

      const totalPayable = amount * blockEntity.price;

      if (totalPayable > userEntity.gold) {
        throw new BadRequestError('Insufficient gold.');
      }

      userEntity.updateGold(userEntity.gold - totalPayable);

      let blockInventory: BlockInventoryEntity;
      const isExists = await this.blockInventoryRepository.isExists(landId, blockId);

      if (isExists) {
        const entity = await this.blockInventoryRepository.find({
          landId,
          blockId,
        });

        const totalAmount = entity.amount + amount;

        if (totalAmount > maxQuantity) {
          throw new BadRequestError('Insufficient level.');
        }

        entity.updateAmount(totalAmount);
        blockInventory = await this.blockInventoryRepository.update(entity);
      } else {
        const entity = new BlockInventoryEntity({
          landId,
          blockId,
          amount,
          inUse: 0,
        });

        blockInventory = await this.blockInventoryRepository.create(entity);
      }

      await this.userRepository.update(userEntity);

      return BlockInventoryOutputMapper.toOutput(blockInventory);
    }
  }
}
