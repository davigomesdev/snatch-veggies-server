import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

import { FindDecorationIventoryUseCase } from '../usecases/find-decoration-inventory.usecase';

export class FindDecorationIventoryDTO implements FindDecorationIventoryUseCase.Input {
  public userId: string;

  public landId: string;

  public decorationId: string;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  public decoration?: boolean;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  public isVisible?: boolean;
}
