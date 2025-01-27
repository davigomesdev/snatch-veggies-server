import { FishPresenter } from '@modules/fish/adapters/fish.presenter';
import { FishInventoryOutput } from '../application/output/fish-inventory.output';

export class FishInventoryPresenter {
  public id: string;
  public landId: string;
  public fishId: string;
  public amount: number;
  public fish?: FishPresenter;

  public constructor(output: FishInventoryOutput) {
    this.id = output.id;
    this.landId = output.landId;
    this.fishId = output.fishId;
    this.amount = output.amount;
    this.fish = output.fish ? new FishPresenter(output.fish) : undefined;
  }
}

export class FishInventoryListPresenter extends Array<FishInventoryPresenter> {
  public constructor(output: FishInventoryOutput[]) {
    super();
    Object.assign(this, output);
  }
}
