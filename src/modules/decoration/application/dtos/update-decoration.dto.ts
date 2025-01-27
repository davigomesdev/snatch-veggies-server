import { TVector2 } from '@core/types/vector2.type';

import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

import { UpdateDecorationUseCase } from '../usecases/update-decoration.usecase';

class Vector2Validator {
  @Min(1)
  @IsInt()
  @IsNotEmpty()
  public x: number;

  @Min(1)
  @IsInt()
  @IsNotEmpty()
  public y: number;
}

export class UpdateDecorationDTO implements UpdateDecorationUseCase.Input {
  public id: string;

  @Min(0)
  @IsInt()
  @IsNotEmpty()
  public index: number;

  @IsString()
  @IsNotEmpty()
  public name: string;

  @Min(0)
  @IsInt()
  @IsOptional()
  public price?: number;

  @Min(1)
  @IsInt()
  @IsOptional()
  public limit?: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => Vector2Validator)
  public size?: TVector2;

  @IsBoolean()
  @IsNotEmpty()
  public isVisible: boolean;
}
