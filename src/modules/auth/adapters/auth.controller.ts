import { TAuth } from '@core/types/auth.type';

import { Body, Controller, HttpCode, Post } from '@nestjs/common';

import { SignInUseCase } from '../application/usecases/signin.usecase';
import { RequestNonceUseCase } from '../application/usecases/request-nonce.usecase';
import { RefreshTokensUseCase } from '../application/usecases/refresh-tokens.usecase';

import { SignInDTO } from '../application/dtos/signin.dto';
import { RequestNonceDTO } from '../application/dtos/request-nonce.dto';
import { RefreshTokensDTO } from '../application/dtos/refresh-tokens.dto';

@Controller('auth')
export class AuthController {
  public constructor(
    private readonly signInUseCase: SignInUseCase.UseCase,
    private readonly requestNonceUseCase: RequestNonceUseCase.UseCase,
    private readonly refreshTokensUseCase: RefreshTokensUseCase.UseCase,
  ) {}

  @HttpCode(200)
  @Post('signin')
  public async signin(@Body() data: SignInDTO): Promise<TAuth> {
    return await this.signInUseCase.execute(data);
  }

  @HttpCode(200)
  @Post('request-nonce')
  public async requestNonce(@Body() data: RequestNonceDTO): Promise<RequestNonceUseCase.Output> {
    return await this.requestNonceUseCase.execute(data);
  }

  @HttpCode(200)
  @Post('refresh')
  public async refreshTokens(@Body() data: RefreshTokensDTO): Promise<TAuth> {
    return await this.refreshTokensUseCase.execute(data);
  }
}
