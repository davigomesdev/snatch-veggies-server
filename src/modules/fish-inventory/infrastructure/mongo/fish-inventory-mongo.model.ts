import { ValidationError } from '@domain/errors/validation-error';

import { Document, Types } from 'mongoose';

import { FishModel } from '@modules/fish/infrastructure/mongo/fish-mongo.model';

import { FishInventoryEntity } from '@modules/fish-inventory/domain/fish-inventory.entity';

export class FishInventoryModel extends Document {
  public _id: Types.ObjectId;
  public landId: string;
  public fishId: FishModel | string;
  public amount: number;

  public static toEntity(model: FishInventoryModel): FishInventoryEntity {
    const data = {
      landId: model.landId,
      fishId: typeof model.fishId === 'string' ? model.fishId : model.fishId._id.toString(),
      amount: model.amount,
    };

    try {
      const entity = new FishInventoryEntity(data, model.id);

      if (typeof model.fishId !== 'string') entity.addEntity(FishModel.toEntity(model.fishId));

      return entity;
    } catch {
      throw new ValidationError('The entity will not be a beneficiary.');
    }
  }
}
