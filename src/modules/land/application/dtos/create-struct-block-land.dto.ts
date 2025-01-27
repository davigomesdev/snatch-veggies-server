import { TVector2 } from '@core/types/vector2.type';

import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, ValidateNested } from 'class-validator';

import { CreateStructBlockLandUseCase } from '../usecases/create-struct-block-land.usecase';

class Vector2 {
  @IsInt()
  public x: number;

  @IsInt()
  public y: number;
}

export class CreateStructBlockLandDTO implements CreateStructBlockLandUseCase.Input {
  @IsString()
  @IsNotEmpty()
  public id: string;

  public userId: string;

  @ValidateNested()
  @Type(() => Vector2)
  public blockPos: TVector2;

  @IsInt()
  @IsNotEmpty()
  public structIndex: number;
}
