import { StructInventoryEntity } from './struct-inventory.entity';

import {
  FindParams as DefaultFindParams,
  FindAllParams as DefaultFindAllParams,
  IRepository,
} from '@domain/repositories/repository.interface';

export namespace StructInventoryRepository {
  export interface BaseParams {
    structId?: string;
    struct?: boolean;
    isVisible?: boolean;
  }

  export interface FindParams extends DefaultFindParams, BaseParams {}

  export interface FindAllParams extends DefaultFindAllParams, BaseParams {}

  export interface Repository
    extends IRepository<StructInventoryEntity, FindParams, FindAllParams> {
    isExists(landId: string, structId: string): Promise<boolean>;
  }
}
