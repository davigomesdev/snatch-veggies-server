import { BlockTypeEnum } from '@core/enums/block-type.enum';

import { ValidationError } from '@domain/errors/validation-error';

import { Document, Types } from 'mongoose';
import { BlockEntity } from '@modules/block/domain/block.entity';

export class BlockModel extends Document {
  public _id: Types.ObjectId;
  public index: number;
  public name: string;
  public price: number;
  public limit: number;
  public type: BlockTypeEnum;
  public isVisible: boolean;
  public image: string;

  public static toEntity(model: BlockModel): BlockEntity {
    const data = {
      index: model.index,
      name: model.name,
      price: model.price,
      limit: model.limit,
      type: model.type,
      image: model.image,
      isVisible: model.isVisible,
    };

    try {
      return new BlockEntity(data, model.id);
    } catch {
      throw new ValidationError('The entity will not be a beneficiary.');
    }
  }
}
