import { TVector2 } from '@core/types/vector2.type';

import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, ValidateNested } from 'class-validator';

import { CreateDecorationBlockLandUseCase } from '../usecases/create-decoration-block-land.usecase';

class Vector2 {
  @IsInt()
  public x: number;

  @IsInt()
  public y: number;
}

export class CreateDecorationBlockLandDTO implements CreateDecorationBlockLandUseCase.Input {
  @IsString()
  @IsNotEmpty()
  public id: string;

  public userId: string;

  @ValidateNested()
  @Type(() => Vector2)
  public blockPos: TVector2;

  @IsInt()
  @IsNotEmpty()
  public decorationIndex: number;
}
