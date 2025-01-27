import { File } from '@nest-lab/fastify-multer';

import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';
import { Transform } from 'class-transformer';

import { CreateFishUseCase } from '../usecases/create-fish.usecase';

export class CreateFishDTO implements CreateFishUseCase.Input {
  @IsString()
  @IsNotEmpty()
  public name: string;

  @Min(0)
  @IsInt()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  public price: number;

  @Min(1)
  @IsInt()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  public rarity: number;

  public image: File;
}
