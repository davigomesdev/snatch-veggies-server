import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

import { FindBlockIventoryUseCase } from '../usecases/find-block-inventory.usecase';

export class FindBlockIventoryDTO implements FindBlockIventoryUseCase.Input {
  public userId: string;

  public landId: string;

  public blockId: string;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  public block?: boolean;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  public isVisible?: boolean;
}
