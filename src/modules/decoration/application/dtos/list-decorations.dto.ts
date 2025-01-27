import { IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

import { ListDecorationsUseCase } from '../usecases/list-decorations.usecase';

export class ListDecorationsDTO implements ListDecorationsUseCase.Input {
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  public isVisible?: boolean;
}
