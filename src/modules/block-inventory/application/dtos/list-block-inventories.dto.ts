import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

import { ListBlockIventoriesUseCase } from '../usecases/list-block-inventories.usecase';

export class ListBlockIventoriesDTO implements ListBlockIventoriesUseCase.Input {
  @IsOptional()
  public userId?: string;

  @IsOptional()
  public landId?: string;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  public block?: boolean;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  public isVisible?: boolean;
}
