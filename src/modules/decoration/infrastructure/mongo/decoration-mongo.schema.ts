import { TVector2 } from '@core/types/vector2.type';

import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Decoration extends Document {
  @Prop({ required: true, unique: true })
  public index: number;

  @Prop({ required: true })
  public name: string;

  @Prop({ required: true, default: 0 })
  public price: number;

  @Prop({ required: true, default: 100 })
  public limit: number;

  @Prop({
    type: {
      x: { type: Number, required: true },
      y: { type: Number, required: true },
    },
    required: true,
    default: { x: 1, y: 1 },
    _id: false,
  })
  public size: TVector2;

  @Prop({ required: true, default: true })
  public isVisible: boolean;

  @Prop({ required: true })
  public image: string;
}

export const DecorationSchema = SchemaFactory.createForClass(Decoration);
