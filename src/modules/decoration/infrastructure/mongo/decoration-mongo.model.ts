import { ValidationError } from '@domain/errors/validation-error';

import { Document, Types } from 'mongoose';
import { DecorationEntity } from '@modules/decoration/domain/decoration.entity';

export class DecorationModel extends Document {
  public _id: Types.ObjectId;
  public index: number;
  public name: string;
  public price: number;
  public limit: number;
  public size: {
    x: number;
    y: number;
  } & Document;
  public isVisible: boolean;
  public image: string;

  public static toEntity(model: DecorationModel): DecorationEntity {
    const data = {
      index: model.index,
      name: model.name,
      price: model.price,
      limit: model.limit,
      size: {
        x: model.size.x,
        y: model.size.y,
      },
      image: model.image,
      isVisible: model.isVisible,
    };

    try {
      return new DecorationEntity(data, model.id);
    } catch {
      throw new ValidationError('The entity will not be a beneficiary.');
    }
  }
}
