import { Controller, Get, HttpCode, Param, Post, Query, UseGuards } from '@nestjs/common';

import { JwtGuard } from '@application/guards/jwt-guard';

import { CurrentUser } from '@core/decorators/current-user.decorator';
import { CurrentLand } from '@core/decorators/current-land.decorator';

import { ListLandsUseCase } from '../application/usecases/list-lands.usecase';
import { FindLandUseCase } from '../application/usecases/find-land.usecase';
import { CreateLandUseCase } from '../application/usecases/create-land.usecase';

import { FindLandDTO } from '../application/dtos/find-land.dto';

import { LandOutput } from '../application/output/land.output';
import { LandListPresenter, LandPresenter } from './land.presenter';

@Controller('lands')
export class LandController {
  public constructor(
    private readonly createLandUseCase: CreateLandUseCase.UseCase,
    private readonly findLandUseCase: FindLandUseCase.UseCase,
    private readonly listLandUseCase: ListLandsUseCase.UseCase,
  ) {}

  private static landToResponse(output: LandOutput): LandPresenter {
    return new LandPresenter(output);
  }

  private static listLandsToResponse(output: ListLandsUseCase.Output): LandListPresenter {
    return new LandListPresenter(output);
  }

  @UseGuards(JwtGuard)
  @HttpCode(204)
  @Post('current')
  public async currentCreate(@CurrentUser('id') userId: string): Promise<CreateLandUseCase.Output> {
    await this.createLandUseCase.execute({ userId });
  }

  @UseGuards(JwtGuard)
  @HttpCode(200)
  @Get('current')
  public async current(
    @CurrentUser('id') userId: string,
    @CurrentLand() id: string,
  ): Promise<LandPresenter> {
    const output = await this.findLandUseCase.execute({
      id,
      userId,
    });
    return LandController.landToResponse(output);
  }

  @HttpCode(200)
  @Get(':tokenId')
  public async findByTokenId(
    @Param('tokenId') tokenId: number,
    @Query() searchParams: FindLandDTO,
  ): Promise<LandPresenter> {
    const output = await this.findLandUseCase.execute({
      tokenId,
      ...searchParams,
    });
    return LandController.landToResponse(output);
  }

  @UseGuards(JwtGuard)
  @HttpCode(200)
  @Get('current/list')
  public async currentList(@CurrentUser('id') userId: string): Promise<LandListPresenter> {
    const output = await this.listLandUseCase.execute({ userId });
    return LandController.listLandsToResponse(output);
  }

  @HttpCode(200)
  @Get()
  public async list(): Promise<LandListPresenter> {
    const output = await this.listLandUseCase.execute();
    return LandController.listLandsToResponse(output);
  }
}
