import { IsOptional, IsString } from 'class-validator';

import { CreateLandUseCase } from '../usecases/create-land.usecase';

export class CreateLandDTO implements CreateLandUseCase.Input {
  public userId: string;

  @IsString()
  @IsOptional()
  public referrerId?: string;
}
