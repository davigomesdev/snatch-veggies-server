import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Fish extends Document {
  @Prop({ required: true })
  public name: string;

  @Prop({ required: true, default: 0 })
  public price: number;

  @Prop({ required: true, default: 1 })
  public rarity: number;

  @Prop({ required: true })
  public image: string;
}

export const FishSchema = SchemaFactory.createForClass(Fish);
