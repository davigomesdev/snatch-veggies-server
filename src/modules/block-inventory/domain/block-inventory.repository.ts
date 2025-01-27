import { BlockInventoryEntity } from './block-inventory.entity';

import {
  FindParams as DefaultFindParams,
  FindAllParams as DefaultFindAllParams,
  IRepository,
} from '@domain/repositories/repository.interface';

export namespace BlockInventoryRepository {
  export interface BaseParams {
    blockId?: string;
    block?: boolean;
    isVisible?: boolean;
  }

  export interface FindParams extends DefaultFindParams, BaseParams {}

  export interface FindAllParams extends DefaultFindAllParams, BaseParams {}

  export interface Repository extends IRepository<BlockInventoryEntity, FindParams, FindAllParams> {
    isExists(landId: string, blockId: string): Promise<boolean>;
    createMany(data: BlockInventoryEntity[]): Promise<BlockInventoryEntity[]>;
  }
}
