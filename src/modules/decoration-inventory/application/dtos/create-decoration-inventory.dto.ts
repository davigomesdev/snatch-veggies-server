import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

import { CreateDecorationInventoryUseCase } from '../usecases/create-decoration-inventory.usecase';

export class CreateDecorationInventoryDTO implements CreateDecorationInventoryUseCase.Input {
  public userId: string;

  public landId: string;

  @IsString()
  @IsNotEmpty()
  public decorationId: string;

  @Min(1)
  @IsInt()
  @IsNotEmpty()
  public amount: number;
}
