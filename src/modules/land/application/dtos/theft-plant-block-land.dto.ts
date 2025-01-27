import { TVector2 } from '@core/types/vector2.type';

import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, ValidateNested } from 'class-validator';

import { TheftPlantBlockLandUseCase } from '../usecases/theft-plant-block-land.usecase';

class Vector2 {
  @IsInt()
  public x: number;

  @IsInt()
  public y: number;
}

export class TheftPlantBlockLandDTO implements TheftPlantBlockLandUseCase.Input {
  @IsString()
  @IsNotEmpty()
  public id: string;

  public userId: string;

  @IsString()
  @IsNotEmpty()
  public landId: string;

  @ValidateNested()
  @Type(() => Vector2)
  public blockPos: TVector2;
}
