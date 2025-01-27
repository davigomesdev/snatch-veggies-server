import { IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

import { ListStructsUseCase } from '../usecases/list-structs.usecase';

export class ListStructsDTO implements ListStructsUseCase.Input {
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  public isVisible?: boolean;
}
