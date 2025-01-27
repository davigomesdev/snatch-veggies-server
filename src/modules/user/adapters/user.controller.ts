import { Body, Controller, Get, HttpCode, Post, UseGuards } from '@nestjs/common';

import { JwtGuard } from '@application/guards/jwt-guard';

import { CurrentUser } from '@core/decorators/current-user.decorator';

import { FindUserUseCase } from '../application/usecases/find-user.usecase';

import { DepositCoinUserDTO } from '../application/dtos/deposit-coin-user.dto';
import { WithdrawCoinUserDTO } from '../application/dtos/withdraw-coin-user.dto';

import { UserPresenter } from './user.presenter';
import { DepositCoinUserUseCase } from '../application/usecases/deposit-coin-user.usecase';
import { WithdrawCoinUserUseCase } from '../application/usecases/withdraw-coin-user.usecase';

@Controller('users')
export class UserController {
  public constructor(
    private readonly findUserUseCase: FindUserUseCase.UseCase,
    private readonly depositCoinUserUseCase: DepositCoinUserUseCase.UseCase,
    private readonly withdrawCoinUserUseCase: WithdrawCoinUserUseCase.UseCase,
  ) {}

  private static userToResponse(output: FindUserUseCase.Output): UserPresenter {
    return new UserPresenter(output);
  }

  @UseGuards(JwtGuard)
  @HttpCode(200)
  @Get('current')
  public async current(@CurrentUser('id') id: string): Promise<UserPresenter> {
    const output = await this.findUserUseCase.execute({ id });
    return UserController.userToResponse(output);
  }

  @UseGuards(JwtGuard)
  @HttpCode(204)
  @Post('deposit')
  public async deposit(
    @CurrentUser('id') id: string,
    @Body() data: DepositCoinUserDTO,
  ): Promise<void> {
    await this.depositCoinUserUseCase.execute({
      id,
      ...data,
    });
  }

  @UseGuards(JwtGuard)
  @HttpCode(204)
  @Post('withdraw')
  public async withdraw(
    @CurrentUser('id') id: string,
    @Body() data: WithdrawCoinUserDTO,
  ): Promise<void> {
    await this.withdrawCoinUserUseCase.execute({
      id,
      ...data,
    });
  }
}
