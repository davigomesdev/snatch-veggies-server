import { ValidationError } from '@domain/errors/validation-error';

import { Document, Types } from 'mongoose';

import { StructModel } from '@modules/struct/infrastructure/mongo/struct-mongo.model';

import { StructInventoryEntity } from '@modules/struct-inventory/domain/struct-inventory.entity';

export class StructInventoryModel extends Document {
  public _id: Types.ObjectId;
  public landId: string;
  public structId: StructModel | string;
  public amount: number;
  public inUse: number;
  public minted: number;

  public static toEntity(model: StructInventoryModel): StructInventoryEntity {
    const data = {
      landId: model.landId,
      structId: typeof model.structId === 'string' ? model.structId : model.structId._id.toString(),
      amount: model.amount,
      inUse: model.inUse,
      minted: model.minted,
    };

    try {
      const entity = new StructInventoryEntity(data, model.id);

      if (typeof model.structId !== 'string')
        entity.addEntity(StructModel.toEntity(model.structId));

      return entity;
    } catch {
      throw new ValidationError('The entity will not be a beneficiary.');
    }
  }
}
