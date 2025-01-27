import { IsInt, IsNotEmpty, Min } from 'class-validator';

import { SaleFishInventoryUseCase } from '../usecases/sale-fish-inventory.usecase';

export class SaleFishInventoryDTO implements SaleFishInventoryUseCase.Input {
  public id: string;

  public userId: string;

  public landId: string;

  @Min(1)
  @IsInt()
  @IsNotEmpty()
  public amount: number;
}
