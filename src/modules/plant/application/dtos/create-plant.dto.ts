import { File } from '@nest-lab/fastify-multer';

import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';
import { Transform } from 'class-transformer';

import { CreatePlantUseCase } from '../usecases/create-plant.usecase';

export class CreatePlantDTO implements CreatePlantUseCase.Input {
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

  @Min(0)
  @IsInt()
  @IsOptional()
  @Transform(({ value }) => Number(value))
  public profit?: number;

  @Min(1)
  @IsInt()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  public duration: number;

  @Min(1)
  @IsInt()
  @IsOptional()
  @Transform(({ value }) => Number(value))
  public exp?: number;

  @IsBoolean()
  @IsNotEmpty()
  @Transform(({ value }) => Boolean(value))
  public isVisible: boolean;

  public image: File;
}
