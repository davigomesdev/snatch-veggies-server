import { IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

import { FindDecorationUseCase } from '../usecases/find-decoration.usecase';

export class FindDecorationDTO implements FindDecorationUseCase.Input {
  public id: string;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  public isVisible?: boolean;
}
