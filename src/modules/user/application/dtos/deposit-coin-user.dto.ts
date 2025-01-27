import { IsInt, IsNotEmpty, Min } from 'class-validator';
import { DepositCoinUserUseCase } from '../usecases/deposit-coin-user.usecase';

export class DepositCoinUserDTO implements DepositCoinUserUseCase.Input {
  public id: string;

  @Min(1)
  @IsInt()
  @IsNotEmpty()
  public amount: number;
}
