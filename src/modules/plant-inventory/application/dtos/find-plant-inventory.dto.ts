import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

import { FindPlantIventoryUseCase } from '../usecases/find-plant-inventory.usecase';

export class FindPlantIventoryDTO implements FindPlantIventoryUseCase.Input {
  public userId: string;

  public landId: string;

  public plantId: string;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  public plant?: boolean;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  public isVisible?: boolean;
}
