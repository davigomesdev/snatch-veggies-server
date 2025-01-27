import { TVector2 } from '@core/types/vector2.type';
import { StructOutput } from '../application/output/struct.output';

export class StructPresenter {
  public id: string;
  public index: number;
  public name: string;
  public itemName: string;
  public price: number;
  public profit: number;
  public limit: number;
  public exp: number;
  public duration: number;
  public size: TVector2;
  public isVisible: boolean;
  public image: string;
  public itemImage: string;

  public constructor(output: StructOutput) {
    this.id = output.id;
    this.index = output.index;
    this.name = output.name;
    this.itemName = output.itemName;
    this.price = output.price;
    this.profit = output.profit;
    this.limit = output.limit;
    this.exp = output.exp;
    this.duration = output.duration;
    this.size = output.size;
    this.isVisible = output.isVisible;
    this.image = output.image;
    this.itemImage = output.itemImage;
  }
}

export class StructListPresenter extends Array<StructPresenter> {
  public constructor(output: StructOutput[]) {
    super();
    Object.assign(this, output);
  }
}
