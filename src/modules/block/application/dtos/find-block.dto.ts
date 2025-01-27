import { IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

import { FindBlockUseCase } from '../usecases/find-block.usecase';

export class FindBlockDTO implements FindBlockUseCase.Input {
  public id: string;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  public isVisible?: boolean;
}
