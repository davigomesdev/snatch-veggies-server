import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true })
  public address: string;

  @Prop({ required: true })
  public nonce: string;

  @Prop({ required: true, default: 0 })
  public gold: number;

  @Prop({ default: null })
  public refreshToken: string | null;
}

export const UserSchema = SchemaFactory.createForClass(User);
