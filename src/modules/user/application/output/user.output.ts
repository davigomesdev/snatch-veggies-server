import { UserEntity } from '@modules/user/domain/user.entity';

export type UserOutput = {
  id: string;
  address: string;
  nonce: string;
  gold: number;
};

export class UserOutputMapper {
  public static toOutput(entity: UserEntity): UserOutput {
    return entity.toManyJSON();
  }
}
