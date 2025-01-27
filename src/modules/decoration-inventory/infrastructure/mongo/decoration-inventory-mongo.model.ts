import { ValidationError } from '@domain/errors/validation-error';

import { Document, Types } from 'mongoose';

import { DecorationModel } from '@modules/decoration/infrastructure/mongo/decoration-mongo.model';

import { DecorationInventoryEntity } from '@modules/decoration-inventory/domain/decoration-inventory.entity';

export class DecorationInventoryModel extends Document {
  public _id: Types.ObjectId;
  public landId: string;
  public decorationId: DecorationModel | string;
  public amount: number;
  public inUse: number;

  public static toEntity(model: DecorationInventoryModel): DecorationInventoryEntity {
    const data = {
      landId: model.landId,
      decorationId:
        typeof model.decorationId === 'string'
          ? model.decorationId
          : model.decorationId._id.toString(),
      amount: model.amount,
      inUse: model.inUse,
    };

    try {
      const entity = new DecorationInventoryEntity(data, model.id);

      if (typeof model.decorationId !== 'string')
        entity.addEntity(DecorationModel.toEntity(model.decorationId));

      return entity;
    } catch {
      throw new ValidationError('The entity will not be a beneficiary.');
    }
  }
}
