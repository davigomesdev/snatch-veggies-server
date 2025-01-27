import { IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

import { FindStructUseCase } from '../usecases/find-struct.usecase';

export class FindStructDTO implements FindStructUseCase.Input {
  public id: string;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  public isVisible?: boolean;
}
