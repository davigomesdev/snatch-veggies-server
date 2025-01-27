import { IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

import { ListBlocksUseCase } from '../usecases/list-blocks.usecase';

export class ListBlocksDTO implements ListBlocksUseCase.Input {
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  public isVisible?: boolean;
}
