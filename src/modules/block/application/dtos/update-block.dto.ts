import { BlockTypeEnum } from '@core/enums/block-type.enum';

import { IsBoolean, IsEnum, IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

import { UpdateBlockUseCase } from '../usecases/update-block.usecase';

export class UpdateBlockDTO implements UpdateBlockUseCase.Input {
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
  @IsNotEmpty()
  public price: number;

  @Min(1)
  @IsInt()
  @IsNotEmpty()
  public limit: number;

  @IsEnum(BlockTypeEnum)
  @IsNotEmpty()
  public type: BlockTypeEnum;

  @IsBoolean()
  @IsNotEmpty()
  public isVisible: boolean;
}
