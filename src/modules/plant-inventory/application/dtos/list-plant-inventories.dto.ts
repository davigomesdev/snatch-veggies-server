import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

import { ListPlantIventoriesUseCase } from '../usecases/list-plant-inventories.usecase';

export class ListPlantIventoriesDTO implements ListPlantIventoriesUseCase.Input {
  @IsOptional()
  public userId?: string;

  @IsOptional()
  public landId?: string;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  public plant?: boolean;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  public isVisible?: boolean;
}
