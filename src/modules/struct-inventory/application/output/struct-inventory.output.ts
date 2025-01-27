import { StructOutput } from '@modules/struct/application/output/struct.output';
import { StructInventoryEntity } from '@modules/struct-inventory/domain/struct-inventory.entity';

export type StructInventoryOutput = {
  id: string;
  landId: string;
  structId: string;
  amount: number;
  inUse: number;
  minted: number;
  struct?: StructOutput;
};

export class StructInventoryOutputMapper {
  public static toOutput(entity: StructInventoryEntity): StructInventoryOutput {
    return entity.toManyJSON();
  }
}
