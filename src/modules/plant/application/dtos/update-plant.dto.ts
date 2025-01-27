import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

import { UpdatePlantUseCase } from '../usecases/update-plant.usecase';

export class UpdatePlantDTO implements UpdatePlantUseCase.Input {
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

  @Min(0)
  @IsInt()
  @IsOptional()
  public profit?: number;

  @Min(1)
  @IsInt()
  @IsNotEmpty()
  public duration: number;

  @Min(1)
  @IsInt()
  @IsOptional()
  public exp?: number;

  @IsBoolean()
  @IsNotEmpty()
  public isVisible: boolean;
}
