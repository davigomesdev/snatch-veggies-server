import { BlockTypeEnum } from '@core/enums/block-type.enum';

import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Block extends Document {
  @Prop({ required: true, unique: true })
  public index: number;

  @Prop({ required: true })
  public name: string;

  @Prop({ required: true, default: 0 })
  public price: number;

  @Prop({ required: true, default: 3600 })
  public limit: number;

  @Prop({ required: true })
  public type: BlockTypeEnum;

  @Prop({ required: true, default: true })
  public isVisible: boolean;

  @Prop({ required: true })
  public image: string;
}

export const BlockSchema = SchemaFactory.createForClass(Block);
