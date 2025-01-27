import { PlantInventoryEntity } from './plant-inventory.entity';

import {
  FindParams as DefaultFindParams,
  FindAllParams as DefaultFindAllParams,
  IRepository,
} from '@domain/repositories/repository.interface';

export namespace PlantInventoryRepository {
  export interface BaseParams {
    userId?: string;
    plantId?: string;
    plant?: boolean;
    isVisible?: boolean;
  }

  export interface FindParams extends DefaultFindParams, BaseParams {}

  export interface FindAllParams extends DefaultFindAllParams, BaseParams {}

  export interface Repository extends IRepository<PlantInventoryEntity, FindParams, FindAllParams> {
    isExists(landId: string, plantId: string): Promise<boolean>;
  }
}
