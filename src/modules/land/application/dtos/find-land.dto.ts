import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

import { FindLandUseCase } from '../usecases/find-land.usecase';

export class FindLandDTO implements FindLandUseCase.Input {
  @IsOptional()
  public id?: string;

  @IsOptional()
  public userId?: string;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  public tokenId?: number;
}
