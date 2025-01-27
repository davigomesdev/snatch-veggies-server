import { IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

import { FindPlantUseCase } from '../usecases/find-plant.usecase';

export class FindPlantDTO implements FindPlantUseCase.Input {
  public id: string;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  public isVisible?: boolean;
}
