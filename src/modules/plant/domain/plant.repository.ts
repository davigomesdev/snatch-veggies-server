import { PlantEntity } from './plant.entity';

import {
  FindParams as DefaultFindParams,
  FindAllParams as DefaultFindAllParams,
  IRepository,
} from '@domain/repositories/repository.interface';

export namespace PlantRepository {
  export interface BaseParams {
    isVisible?: boolean;
  }

  export interface FindParams extends DefaultFindParams, BaseParams {
    index?: number;
  }

  export interface FindAllParams extends DefaultFindAllParams, BaseParams {}

  export interface Repository extends IRepository<PlantEntity, FindParams, FindAllParams> {
    indexExists(index: number): Promise<void>;
  }
}
