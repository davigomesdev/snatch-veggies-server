import { IsInt, IsNotEmpty, Min } from 'class-validator';
import { WithdrawCoinUserUseCase } from '../usecases/withdraw-coin-user.usecase';

export class WithdrawCoinUserDTO implements WithdrawCoinUserUseCase.Input {
  public id: string;

  @Min(1)
  @IsInt()
  @IsNotEmpty()
  public amount: number;
}
