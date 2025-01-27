import { LandEntity } from '@modules/land/domain/land.entity';

export type LandOutput = {
  id: string;
  userId: string;
  tokenId: number;
  name: string;
  exp: number;
  lastTheftDate: Date;
  lastStolenDate: Date;
  theftCount: number;
  stolenCount: number;
};

export class LandOutputMapper {
  public static toOutput(entity: LandEntity): LandOutput {
    return entity.toManyJSON();
  }
}
