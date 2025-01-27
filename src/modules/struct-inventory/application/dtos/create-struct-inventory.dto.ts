import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

import { CreateStructInventoryUseCase } from '../usecases/create-struct-inventory.usecase';

export class CreateStructInventoryDTO implements CreateStructInventoryUseCase.Input {
  public userId: string;

  public landId: string;

  @IsString()
  @IsNotEmpty()
  public structId: string;

  @Min(1)
  @IsInt()
  @IsNotEmpty()
  public amount: number;
}
