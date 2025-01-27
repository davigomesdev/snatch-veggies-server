import { IsInt, IsNotEmpty, Min } from 'class-validator';

import { SalePlantInventoryUseCase } from '../usecases/sale-plant-inventory.usecase';

export class SalePlantInventoryDTO implements SalePlantInventoryUseCase.Input {
  public id: string;

  public userId: string;

  public landId: string;

  @Min(1)
  @IsInt()
  @IsNotEmpty()
  public amount: number;
}
