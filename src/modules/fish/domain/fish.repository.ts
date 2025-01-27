import { FishEntity } from './fish.entity';

import {
  FindParams as DefaultFindParams,
  FindAllParams as DefaultFindAllParams,
  IRepository,
} from '@domain/repositories/repository.interface';

export namespace FishRepository {
  export interface FindParams extends DefaultFindParams {}

  export interface FindAllParams extends DefaultFindAllParams {}

  export interface Repository extends IRepository<FishEntity, FindParams, FindAllParams> {}
}
