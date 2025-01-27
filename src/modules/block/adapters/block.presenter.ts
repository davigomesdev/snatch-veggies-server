import { BlockTypeEnum } from '@core/enums/block-type.enum';
import { BlockOutput } from '../application/output/block.output';

export class BlockPresenter {
  public id: string;
  public index: number;
  public name: string;
  public price: number;
  public limit: number;
  public type: BlockTypeEnum;
  public isVisible: boolean;
  public image: string;

  public constructor(output: BlockOutput) {
    this.id = output.id;
    this.index = output.index;
    this.name = output.name;
    this.price = output.price;
    this.limit = output.limit;
    this.type = output.type;
    this.isVisible = output.isVisible;
    this.image = output.image;
  }
}

export class BlockListPresenter extends Array<BlockPresenter> {
  public constructor(output: BlockOutput[]) {
    super();
    Object.assign(this, output);
  }
}
