import { ValidationError } from '@domain/errors/validation-error';

import { Document, Types } from 'mongoose';
import { UserEntity } from '@modules/user/domain/user.entity';

export class UserModel extends Document {
  public _id: Types.ObjectId;
  public address: string;
  public nonce: string;
  public gold: number;
  public refreshToken: string | null;

  public static toEntity(model: UserModel): UserEntity {
    const data = {
      address: model.address,
      nonce: model.nonce,
      gold: model.gold,
      refreshToken: model.refreshToken,
    };

    try {
      return new UserEntity(data, model.id);
    } catch {
      throw new ValidationError('The entity will not be a beneficiary.');
    }
  }
}
