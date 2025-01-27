import { BlockPresenter } from '@modules/block/adapters/block.presenter';
import { BlockInventoryOutput } from '../application/output/block-inventory.output';

export class BlockInventoryPresenter {
  public id: string;
  public landId: string;
  public blockId: string;
  public amount: number;
  public inUse: number;
  public block?: BlockPresenter;

  public constructor(output: BlockInventoryOutput) {
    this.id = output.id;
    this.landId = output.landId;
    this.blockId = output.blockId;
    this.amount = output.amount;
    this.inUse = output.inUse;
    this.block = output.block ? new BlockPresenter(output.block) : undefined;
  }
}

export class BlockInventoryListPresenter extends Array<BlockInventoryPresenter> {
  public constructor(output: BlockInventoryOutput[]) {
    super();
    Object.assign(this, output);
  }
}
