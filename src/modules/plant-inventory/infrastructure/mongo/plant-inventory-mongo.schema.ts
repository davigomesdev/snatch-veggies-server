import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class PlantInventory extends Document {
  @Prop({ type: Types.ObjectId, ref: 'land', required: true })
  public landId: string;

  @Prop({ type: Types.ObjectId, ref: 'plant', required: true })
  public plantId: string;

  @Prop({ required: true, default: 0 })
  public amount: number;

  @Prop({ required: true, default: 0 })
  public inUse: number;

  @Prop({ required: true, default: 0 })
  public harvest: number;
}

export const PlantInventorySchema = SchemaFactory.createForClass(PlantInventory);
PlantInventorySchema.index({ landId: 1, plantId: 1 }, { unique: true });
