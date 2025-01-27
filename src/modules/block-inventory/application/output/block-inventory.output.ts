import { BlockOutput } from '@modules/block/application/output/block.output';
import { BlockInventoryEntity } from '@modules/block-inventory/domain/block-inventory.entity';

export type BlockInventoryOutput = {
  id: string;
  landId: string;
  blockId: string;
  amount: number;
  inUse: number;
  block?: BlockOutput;
};

export class BlockInventoryOutputMapper {
  public static toOutput(entity: BlockInventoryEntity): BlockInventoryOutput {
    return entity.toManyJSON();
  }
}
