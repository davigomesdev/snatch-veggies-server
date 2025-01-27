import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

import { ListFishIventoriesUseCase } from '../usecases/list-fish-inventories.usecase';

export class ListFishIventoriesDTO implements ListFishIventoriesUseCase.Input {
  @IsOptional()
  public userId?: string;

  @IsOptional()
  public landId?: string;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  public fish?: boolean;
}
