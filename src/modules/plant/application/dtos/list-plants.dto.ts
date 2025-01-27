import { IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

import { ListPlantsUseCase } from '../usecases/list-plants.usecase';

export class ListPlantsDTO implements ListPlantsUseCase.Input {
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  public isVisible?: boolean;
}
