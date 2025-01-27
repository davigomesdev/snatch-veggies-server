import { UserOutput } from '../application/output/user.output';

export class UserPresenter {
  public id: string;
  public address: string;
  public gold: number;

  public constructor(output: UserOutput) {
    this.id = output.id;
    this.address = output.address;
    this.gold = output.gold;
  }
}
