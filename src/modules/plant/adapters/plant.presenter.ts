import { PlantOutput } from '../application/output/plant.output';

export class PlantPresenter {
  public id: string;
  public index: number;
  public name: string;
  public price: number;
  public duration: number;
  public exp: number;
  public isVisible: boolean;
  public image: string;

  public constructor(output: PlantOutput) {
    this.id = output.id;
    this.index = output.index;
    this.name = output.name;
    this.price = output.price;
    this.duration = output.duration;
    this.exp = output.exp;
    this.isVisible = output.isVisible;
    this.image = output.image;
  }
}

export class PlantListPresenter extends Array<PlantPresenter> {
  public constructor(output: PlantOutput[]) {
    super();
    Object.assign(this, output);
  }
}
