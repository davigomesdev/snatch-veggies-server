import { UserEntity } from './user.entity';

import {
  FindParams as DefaultFindParams,
  FindAllParams as DefaultFindAllParams,
  IRepository,
} from '@domain/repositories/repository.interface';

export namespace UserRepository {
  export interface FindParams extends DefaultFindParams {
    address?: string;
  }

  export interface FindAllParams extends DefaultFindAllParams {}

  export interface Repository extends IRepository<UserEntity, FindParams, FindAllParams> {
    isExists(address: string): Promise<boolean>;
    addressExists(address: string): Promise<void>;
  }
}
