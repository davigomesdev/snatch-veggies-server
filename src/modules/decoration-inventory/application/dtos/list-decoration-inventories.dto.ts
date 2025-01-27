import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

import { ListDecorationIventoriesUseCase } from '../usecases/list-decoration-inventories.usecase';

export class ListDecorationIventoriesDTO implements ListDecorationIventoriesUseCase.Input {
  @IsOptional()
  public userId?: string;

  @IsOptional()
  public landId?: string;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  public decoration?: boolean;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  public isVisible?: boolean;
}
