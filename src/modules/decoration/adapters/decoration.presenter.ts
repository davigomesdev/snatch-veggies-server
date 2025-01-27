import { TVector2 } from '@core/types/vector2.type';
import { DecorationOutput } from '../application/output/decoration.output';

export class DecorationPresenter {
  public id: string;
  public index: number;
  public name: string;
  public price: number;
  public limit: number;
  public size: TVector2;
  public isVisible: boolean;
  public image: string;

  public constructor(output: DecorationOutput) {
    this.id = output.id;
    this.index = output.index;
    this.name = output.name;
    this.price = output.price;
    this.limit = output.limit;
    this.size = output.size;
    this.isVisible = output.isVisible;
    this.image = output.image;
  }
}

export class DecorationListPresenter extends Array<DecorationPresenter> {
  public constructor(output: DecorationOutput[]) {
    super();
    Object.assign(this, output);
  }
}
