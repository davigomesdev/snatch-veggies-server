import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

import { CreatePlantInventoryUseCase } from '../usecases/create-plant-inventory.usecase';

export class CreatePlantInventoryDTO implements CreatePlantInventoryUseCase.Input {
  public userId: string;

  public landId: string;

  @IsString()
  @IsNotEmpty()
  public plantId: string;

  @Min(1)
  @IsInt()
  @IsNotEmpty()
  public amount: number;
}
