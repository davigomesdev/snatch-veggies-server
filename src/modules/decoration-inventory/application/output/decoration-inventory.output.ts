import { DecorationOutput } from '@modules/decoration/application/output/decoration.output';
import { DecorationInventoryEntity } from '@modules/decoration-inventory/domain/decoration-inventory.entity';

export type DecorationInventoryOutput = {
  id: string;
  landId: string;
  decorationId: string;
  amount: number;
  inUse: number;
  decoration?: DecorationOutput;
};

export class DecorationInventoryOutputMapper {
  public static toOutput(entity: DecorationInventoryEntity): DecorationInventoryOutput {
    return entity.toManyJSON();
  }
}
