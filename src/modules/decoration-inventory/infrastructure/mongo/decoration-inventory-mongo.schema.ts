import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class DecorationInventory extends Document {
  @Prop({ type: Types.ObjectId, ref: 'land', required: true })
  public landId: string;

  @Prop({ type: Types.ObjectId, ref: 'decoration', required: true })
  public decorationId: string;

  @Prop({ required: true, default: 0 })
  public amount: number;

  @Prop({ required: true, default: 0 })
  public inUse: number;
}

export const DecorationInventorySchema = SchemaFactory.createForClass(DecorationInventory);
DecorationInventorySchema.index({ landId: 1, decorationId: 1 }, { unique: true });
