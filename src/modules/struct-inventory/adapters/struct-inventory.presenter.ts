import { StructPresenter } from '@modules/struct/adapters/struct.presenter';
import { StructInventoryOutput } from '../application/output/struct-inventory.output';

export class StructInventoryPresenter {
  public id: string;
  public landId: string;
  public structId: string;
  public amount: number;
  public inUse: number;
  public minted: number;
  public struct?: StructPresenter;

  public constructor(output: StructInventoryOutput) {
    this.id = output.id;
    this.landId = output.landId;
    this.structId = output.structId;
    this.amount = output.amount;
    this.inUse = output.inUse;
    this.minted = output.minted;
    this.struct = output.struct ? new StructPresenter(output.struct) : undefined;
  }
}

export class StructInventoryListPresenter extends Array<StructInventoryPresenter> {
  public constructor(output: StructInventoryOutput[]) {
    super();
    Object.assign(this, output);
  }
}
