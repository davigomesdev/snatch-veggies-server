import { ValidationError } from '@domain/errors/validation-error';

import { Document, Types } from 'mongoose';

import { BlockModel } from '@modules/block/infrastructure/mongo/block-mongo.model';

import { BlockInventoryEntity } from '@modules/block-inventory/domain/block-inventory.entity';

export class BlockInventoryModel extends Document {
  public _id: Types.ObjectId;
  public landId: string;
  public blockId: BlockModel | string;
  public amount: number;
  public inUse: number;

  public static toEntity(model: BlockInventoryModel): BlockInventoryEntity {
    const data = {
      landId: model.landId,
      blockId: typeof model.blockId === 'string' ? model.blockId : model.blockId._id.toString(),
      amount: model.amount,
      inUse: model.inUse,
    };

    try {
      const entity = new BlockInventoryEntity(data, model.id);

      if (typeof model.blockId !== 'string') entity.addEntity(BlockModel.toEntity(model.blockId));

      return entity;
    } catch {
      throw new ValidationError('The entity will not be a beneficiary.');
    }
  }
}
