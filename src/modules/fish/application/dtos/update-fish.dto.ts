import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

import { UpdateFishUseCase } from '../usecases/update-fish.usecase';

export class UpdateFishDTO implements UpdateFishUseCase.Input {
  public id: string;

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
  public rarity: number;
}
