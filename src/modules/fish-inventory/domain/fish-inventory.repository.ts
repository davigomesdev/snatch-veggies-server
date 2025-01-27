import { FishInventoryEntity } from './fish-inventory.entity';

import {
  FindParams as DefaultFindParams,
  FindAllParams as DefaultFindAllParams,
  IRepository,
} from '@domain/repositories/repository.interface';

export namespace FishInventoryRepository {
  export interface BaseParams {
    fishId?: string;
    fish?: boolean;
  }

  export interface FindParams extends DefaultFindParams, BaseParams {}

  export interface FindAllParams extends DefaultFindAllParams, BaseParams {}

  export interface Repository extends IRepository<FishInventoryEntity, FindParams, FindAllParams> {
    isExists(landId: string, fishId: string): Promise<boolean>;
  }
}
