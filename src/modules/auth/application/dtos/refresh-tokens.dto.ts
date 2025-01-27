import { IsNotEmpty, IsString } from 'class-validator';
import { RefreshTokensUseCase } from '../usecases/refresh-tokens.usecase';

export class RefreshTokensDTO implements RefreshTokensUseCase.Input {
  @IsString()
  @IsNotEmpty()
  public refreshToken: string;
}
