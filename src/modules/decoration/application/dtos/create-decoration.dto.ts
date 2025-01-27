import { File } from '@nest-lab/fastify-multer';

import { TVector2 } from '@core/types/vector2.type';

import { BadRequestError } from '@domain/errors/bad-request-error';

import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

import { CreateDecorationUseCase } from '../usecases/create-decoration.usecase';

class Vector2Validator {
  public constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  @Min(1)
  @IsInt()
  @IsNotEmpty()
  public x: number;

  @Min(1)
  @IsInt()
  @IsNotEmpty()
  public y: number;
}

export class CreateDecorationDTO implements CreateDecorationUseCase.Input {
  @Min(0)
  @IsInt()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  public index: number;

  @IsString()
  @IsNotEmpty()
  public name: string;

  @Min(0)
  @IsInt()
  @IsOptional()
  @Transform(({ value }) => Number(value))
  public price?: number;

  @Min(1)
  @IsInt()
  @IsOptional()
  @Transform(({ value }) => Number(value))
  public limit?: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => Vector2Validator)
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value.trim());
        return new Vector2Validator(Number(parsed.x), Number(parsed.y));
      } catch (error) {
        throw new BadRequestError(
          'Invalid format for size. Must be a valid JSON object like { "x": number, "y": number }.',
        );
      }
    }
    return value;
  })
  public size?: TVector2;

  @IsBoolean()
  @IsNotEmpty()
  @Transform(({ value }) => Boolean(value))
  public isVisible: boolean;

  public image: File;
}
