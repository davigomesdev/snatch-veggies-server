import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

import { CreateBlockInventoryUseCase } from '../usecases/create-block-inventory.usecase';

export class CreateBlockInventoryDTO implements CreateBlockInventoryUseCase.Input {
  public userId: string;

  public landId: string;

  @IsString()
  @IsNotEmpty()
  public blockId: string;

  @Min(1)
  @IsInt()
  @IsNotEmpty()
  public amount: number;
}
