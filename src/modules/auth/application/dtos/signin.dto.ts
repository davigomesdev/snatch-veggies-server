import { IsNotEmpty, IsString } from 'class-validator';
import { SignInUseCase } from '../usecases/signin.usecase';

export class SignInDTO implements SignInUseCase.Input {
  @IsString()
  @IsNotEmpty()
  public address: string;

  @IsString()
  @IsNotEmpty()
  public signature: string;
}
