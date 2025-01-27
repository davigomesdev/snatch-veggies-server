import { File } from '@nest-lab/fastify-multer';

import { BlockTypeEnum } from '@core/enums/block-type.enum';

import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

import { CreateBlockUseCase } from '../usecases/create-block.usecase';

export class CreateBlockDTO implements CreateBlockUseCase.Input {
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
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  public price: number;

  @Min(1)
  @IsInt()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  public limit: number;

  @IsEnum(BlockTypeEnum)
  @IsNotEmpty()
  public type: BlockTypeEnum;

  @IsBoolean()
  @IsNotEmpty()
  @Transform(({ value }) => Boolean(value))
  public isVisible: boolean;

  public image: File;
}
