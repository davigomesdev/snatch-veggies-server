import { IsInt, IsNotEmpty, Min } from 'class-validator';

import { SaleStructInventoryUseCase } from '../usecases/sale-struct-inventory.usecase';

export class SaleStructInventoryDTO implements SaleStructInventoryUseCase.Input {
  public id: string;

  public userId: string;

  public landId: string;

  @Min(1)
  @IsInt()
  @IsNotEmpty()
  public amount: number;
}
