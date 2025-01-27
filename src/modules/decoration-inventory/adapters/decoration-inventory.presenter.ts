import { DecorationPresenter } from '@modules/decoration/adapters/decoration.presenter';
import { DecorationInventoryOutput } from '../application/output/decoration-inventory.output';

export class DecorationInventoryPresenter {
  public id: string;
  public landId: string;
  public decorationId: string;
  public amount: number;
  public inUse: number;
  public decoration?: DecorationPresenter;

  public constructor(output: DecorationInventoryOutput) {
    this.id = output.id;
    this.landId = output.landId;
    this.decorationId = output.decorationId;
    this.amount = output.amount;
    this.inUse = output.inUse;
    this.decoration = output.decoration ? new DecorationPresenter(output.decoration) : undefined;
  }
}

export class DecorationInventoryListPresenter extends Array<DecorationInventoryPresenter> {
  public constructor(output: DecorationInventoryOutput[]) {
    super();
    Object.assign(this, output);
  }
}
