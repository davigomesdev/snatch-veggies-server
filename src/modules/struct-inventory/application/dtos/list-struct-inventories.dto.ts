import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

import { ListStructIventoriesUseCase } from '../usecases/list-struct-inventories.usecase';

export class ListStructIventoriesDTO implements ListStructIventoriesUseCase.Input {
  @IsOptional()
  public userId?: string;

  @IsOptional()
  public landId?: string;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  public struct?: boolean;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  public isVisible?: boolean;
}
