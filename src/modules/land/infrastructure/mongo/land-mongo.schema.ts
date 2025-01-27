import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Land extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  public userId: string;

  @Prop({ required: true, unique: true })
  public tokenId: number;

  @Prop({ required: true })
  public name: string;

  @Prop({ required: true, default: 0 })
  public exp: number;

  @Prop({ required: true })
  public lastTheftDate: Date;

  @Prop({ required: true })
  public lastStolenDate: Date;

  @Prop({ required: true, default: 0 })
  public theftCount: number;

  @Prop({ required: true, default: 0 })
  public stolenCount: number;
}

export const LandSchema = SchemaFactory.createForClass(Land);
