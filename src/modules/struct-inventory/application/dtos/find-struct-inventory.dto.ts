import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

import { FindStructIventoryUseCase } from '../usecases/find-struct-inventory.usecase';

export class FindStructIventoryDTO implements FindStructIventoryUseCase.Input {
  public userId: string;

  public landId: string;

  public structId: string;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  public struct?: boolean;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  public isVisible?: boolean;
}
