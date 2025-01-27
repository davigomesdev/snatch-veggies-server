import { DecorationInventoryEntity } from './decoration-inventory.entity';

import {
  FindParams as DefaultFindParams,
  FindAllParams as DefaultFindAllParams,
  IRepository,
} from '@domain/repositories/repository.interface';

export namespace DecorationInventoryRepository {
  export interface BaseParams {
    decorationId?: string;
    decoration?: boolean;
    isVisible?: boolean;
  }

  export interface FindParams extends DefaultFindParams, BaseParams {}

  export interface FindAllParams extends DefaultFindAllParams, BaseParams {}

  export interface Repository
    extends IRepository<DecorationInventoryEntity, FindParams, FindAllParams> {
    isExists(landId: string, decorationId: string): Promise<boolean>;
    createMany(data: DecorationInventoryEntity[]): Promise<DecorationInventoryEntity[]>;
  }
}
