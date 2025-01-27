import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class BlockInventory extends Document {
  @Prop({ type: Types.ObjectId, ref: 'land', required: true })
  public landId: string;

  @Prop({ type: Types.ObjectId, ref: 'block', required: true })
  public blockId: string;

  @Prop({ required: true, default: 0 })
  public amount: number;

  @Prop({ required: true, default: 0 })
  public inUse: number;
}

export const BlockInventorySchema = SchemaFactory.createForClass(BlockInventory);
BlockInventorySchema.index({ landId: 1, blockId: 1 }, { unique: true });
