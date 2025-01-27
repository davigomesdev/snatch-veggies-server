import { ValidationError } from '@domain/errors/validation-error';

import { Document, Types } from 'mongoose';
import { FishEntity } from '@modules/fish/domain/fish.entity';

export class FishModel extends Document {
  public _id: Types.ObjectId;
  public name: string;
  public price: number;
  public rarity: number;
  public image: string;

  public static toEntity(model: FishModel): FishEntity {
    const data = {
      name: model.name,
      price: model.price,
      rarity: model.rarity,
      image: model.image,
    };

    try {
      return new FishEntity(data, model.id);
    } catch {
      throw new ValidationError('The entity will not be a beneficiary.');
    }
  }
}
