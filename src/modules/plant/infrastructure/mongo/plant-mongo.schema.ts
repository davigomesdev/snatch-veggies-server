import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Plant extends Document {
  @Prop({ required: true, unique: true })
  public index: number;

  @Prop({ required: true })
  public name: string;

  @Prop({ required: true, default: 0 })
  public price: number;

  @Prop({ required: true, default: 0 })
  public profit: number;

  @Prop({ required: true })
  public duration: number;

  @Prop({ required: true, default: 1 })
  public exp: number;

  @Prop({ required: true, default: true })
  public isVisible: boolean;

  @Prop({ required: true })
  public image: string;
}

export const PlantSchema = SchemaFactory.createForClass(Plant);
