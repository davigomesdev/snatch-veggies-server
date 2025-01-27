import { Transform } from 'class-transformer';
import { LandOutput } from '../application/output/land.output';

export class LandPresenter {
  public id: string;
  public userId: string;
  public tokenId: number;
  public name: string;
  public exp: number;

  @Transform(({ value }: { value: Date }) => value.toISOString())
  public lastTheftDate: Date;

  @Transform(({ value }: { value: Date }) => value.toISOString())
  public lastStolenDate: Date;

  public theftCount: number;
  public stolenCount: number;

  public constructor(output: LandOutput) {
    this.id = output.id;
    this.userId = output.userId;
    this.tokenId = output.tokenId;
    this.name = output.name;
    this.exp = output.exp;
    this.lastTheftDate = output.lastTheftDate;
    this.lastStolenDate = output.lastStolenDate;
    this.theftCount = output.theftCount;
    this.stolenCount = output.stolenCount;
  }
}

export class LandListPresenter extends Array<LandPresenter> {
  public constructor(output: LandOutput[]) {
    super();
    Object.assign(this, output);
  }
}
