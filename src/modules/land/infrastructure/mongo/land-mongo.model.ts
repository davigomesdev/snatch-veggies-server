import { ValidationError } from '@domain/errors/validation-error';

import { Document, Types } from 'mongoose';
import { LandEntity } from '@modules/land/domain/land.entity';

export class LandModel extends Document {
  public _id: Types.ObjectId;
  public userId: string;
  public referrerId: string | null;
  public tokenId: number;
  public name: string;
  public exp: number;
  public lastTheftDate: Date;
  public lastStolenDate: Date;
  public theftCount: number;
  public stolenCount: number;

  public static toEntity(model: LandModel): LandEntity {
    const data = {
      userId: model.userId,
      referrerId: model.referrerId,
      tokenId: model.tokenId,
      name: model.name,
      exp: model.exp,
      lastTheftDate: model.lastTheftDate,
      lastStolenDate: model.lastStolenDate,
      theftCount: model.theftCount,
      stolenCount: model.stolenCount,
    };

    try {
      return new LandEntity(data, model.id);
    } catch {
      throw new ValidationError('The entity will not be a beneficiary.');
    }
  }
}
