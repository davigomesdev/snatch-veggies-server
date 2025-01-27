import { IsNotEmpty, IsString } from 'class-validator';
import { RequestNonceUseCase } from '../usecases/request-nonce.usecase';

export class RequestNonceDTO implements RequestNonceUseCase.Input {
  @IsString()
  @IsNotEmpty()
  public address: string;
}
