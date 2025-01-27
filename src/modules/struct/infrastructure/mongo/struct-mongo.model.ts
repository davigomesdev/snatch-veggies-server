import { ValidationError } from '@domain/errors/validation-error';

import { Document, Types } from 'mongoose';
import { StructEntity } from '@modules/struct/domain/struct.entity';

export class StructModel extends Document {
  public _id: Types.ObjectId;
  public index: number;
  public name: string;
  public itemName: string;
  public price: number;
  public profit: number;
  public limit: number;
  public exp: number;
  public duration: number;
  public size: {
    x: number;
    y: number;
  } & Document;
  public isVisible: boolean;
  public image: string;
  public itemImage: string | null;

  public static toEntity(model: StructModel): StructEntity {
    const data = {
      index: model.index,
      name: model.name,
      itemName: model.itemName,
      price: model.price,
      profit: model.profit,
      limit: model.limit,
      exp: model.exp,
      duration: model.duration,
      size: {
        x: model.size.x,
        y: model.size.y,
      },
      image: model.image,
      itemImage: model.itemImage,
      isVisible: model.isVisible,
    };

    try {
      return new StructEntity(data, model.id);
    } catch {
      throw new ValidationError('The entity will not be a beneficiary.');
    }
  }
}
