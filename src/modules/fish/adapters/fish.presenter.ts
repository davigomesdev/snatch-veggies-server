import { FishOutput } from '../application/output/fish.output';

export class FishPresenter {
  public id: string;
  public name: string;
  public price: number;
  public rarity: number;
  public image: string;

  public constructor(output: FishOutput) {
    this.id = output.id;
    this.name = output.name;
    this.price = output.price;
    this.rarity = output.rarity;
    this.image = output.image;
  }
}

export class FishListPresenter extends Array<FishPresenter> {
  public constructor(output: FishOutput[]) {
    super();
    Object.assign(this, output);
  }
}
