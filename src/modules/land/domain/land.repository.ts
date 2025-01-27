import { LandEntity } from './land.entity';

import {
  FindParams as DefaultFindParams,
  FindAllParams as DefaultFindAllParams,
  IRepository,
} from '@domain/repositories/repository.interface';

export namespace LandRepository {
  export interface BaseParams {
    userId?: string;
    tokenId?: number;
  }

  export interface FindParams extends DefaultFindParams, BaseParams {}

  export interface FindAllParams extends DefaultFindAllParams, BaseParams {}

  export interface Repository extends IRepository<LandEntity, FindParams, FindAllParams> {
    isExists(tokenId: number): Promise<boolean>;
  }
}
