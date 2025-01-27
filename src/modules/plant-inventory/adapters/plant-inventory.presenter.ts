import { PlantPresenter } from '@modules/plant/adapters/plant.presenter';
import { PlantInventoryOutput } from '../application/output/plant-inventory.output';

export class PlantInventoryPresenter {
  public id: string;
  public landId: string;
  public plantId: string;
  public amount: number;
  public inUse: number;
  public harvest: number;
  public plant?: PlantPresenter;

  public constructor(output: PlantInventoryOutput) {
    this.id = output.id;
    this.landId = output.landId;
    this.plantId = output.plantId;
    this.amount = output.amount;
    this.inUse = output.inUse;
    this.harvest = output.harvest;
    this.plant = output.plant ? new PlantPresenter(output.plant) : undefined;
  }
}

export class PlantInventoryListPresenter extends Array<PlantInventoryPresenter> {
  public constructor(output: PlantInventoryOutput[]) {
    super();
    Object.assign(this, output);
  }
}
