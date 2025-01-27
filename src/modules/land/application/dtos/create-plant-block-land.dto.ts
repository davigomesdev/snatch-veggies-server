import { TVector2 } from '@core/types/vector2.type';

import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, ValidateNested } from 'class-validator';

import { CreatePlantBlockLandUseCase } from '../usecases/create-plant-block-land.usecase';

class Vector2 {
  @IsInt()
  public x: number;

  @IsInt()
  public y: number;
}

export class CreatePlantBlockLandDTO implements CreatePlantBlockLandUseCase.Input {
  @IsString()
  @IsNotEmpty()
  public id: string;

  public userId: string;

  @ValidateNested()
  @Type(() => Vector2)
  public blockPos: TVector2;

  @IsInt()
  @IsNotEmpty()
  public plantIndex: number;
}
