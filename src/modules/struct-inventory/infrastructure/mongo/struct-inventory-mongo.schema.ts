import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class StructInventory extends Document {
  @Prop({ type: Types.ObjectId, ref: 'land', required: true })
  public landId: string;

  @Prop({ type: Types.ObjectId, ref: 'struct', required: true })
  public structId: string;

  @Prop({ required: true, default: 0 })
  public amount: number;

  @Prop({ required: true, default: 0 })
  public inUse: number;

  @Prop({ required: true, default: 0 })
  public minted: number;
}

export const StructInventorySchema = SchemaFactory.createForClass(StructInventory);
StructInventorySchema.index({ landId: 1, structId: 1 }, { unique: true });
