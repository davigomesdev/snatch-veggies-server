import { BlockTypeEnum } from '@core/enums/block-type.enum';

import { BlockEntity } from './block.entity';

import {
  FindParams as DefaultFindParams,
  FindAllParams as DefaultFindAllParams,
  IRepository,
} from '@domain/repositories/repository.interface';

export namespace BlockRepository {
  export interface BaseParams {
    type?: BlockTypeEnum;
    isVisible?: boolean;
  }

  export interface FindParams extends DefaultFindParams, BaseParams {
    index?: number;
  }

  export interface FindAllParams extends DefaultFindAllParams, BaseParams {}

  export interface Repository extends IRepository<BlockEntity, FindParams, FindAllParams> {
    indexExists(index: number): Promise<void>;
  }
}
