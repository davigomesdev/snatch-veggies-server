import { ValidationError } from '@domain/errors/validation-error';

import { Document, Types } from 'mongoose';

import { PlantModel } from '@modules/plant/infrastructure/mongo/plant-mongo.model';

import { PlantInventoryEntity } from '@modules/plant-inventory/domain/plant-inventory.entity';

export class PlantInventoryModel extends Document {
  public _id: Types.ObjectId;
  public landId: string;
  public plantId: PlantModel | string;
  public amount: number;
  public inUse: number;
  public harvest: number;

  public static toEntity(model: PlantInventoryModel): PlantInventoryEntity {
    const data = {
      landId: model.landId,
      plantId: typeof model.plantId === 'string' ? model.plantId : model.plantId._id.toString(),
      amount: model.amount,
      inUse: model.inUse,
      harvest: model.harvest,
    };

    try {
      const entity = new PlantInventoryEntity(data, model.id);

      if (typeof model.plantId !== 'string') entity.addEntity(PlantModel.toEntity(model.plantId));

      return entity;
    } catch {
      throw new ValidationError('The entity will not be a beneficiary.');
    }
  }
}
