import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class FishInventory extends Document {
  @Prop({ type: Types.ObjectId, ref: 'land', required: true })
  public landId: string;

  @Prop({ type: Types.ObjectId, ref: 'fish', required: true })
  public fishId: string;

  @Prop({ required: true, default: 0 })
  public amount: number;
}

export const FishInventorySchema = SchemaFactory.createForClass(FishInventory);
FishInventorySchema.index({ landId: 1, fishId: 1 }, { unique: true });
