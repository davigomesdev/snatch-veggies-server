import { ValidationError } from '@domain/errors/validation-error';

import { Document, Types } from 'mongoose';
import { PlantEntity } from '@modules/plant/domain/plant.entity';

export class PlantModel extends Document {
  public _id: Types.ObjectId;
  public index: number;
  public name: string;
  public price: number;
  public profit: number;
  public duration: number;
  public isVisible: boolean;
  public image: string;

  public static toEntity(model: PlantModel): PlantEntity {
    const data = {
      index: model.index,
      name: model.name,
      price: model.price,
      profit: model.profit,
      duration: model.duration,
      image: model.image,
      isVisible: model.isVisible,
    };

    try {
      return new PlantEntity(data, model.id);
    } catch {
      throw new ValidationError('The entity will not be a beneficiary.');
    }
  }
}
