import { Body, Controller, Get, HttpCode, Param, Post, Query, UseGuards } from '@nestjs/common';

import { JwtGuard } from '@application/guards/jwt-guard';

import { CurrentUser } from '@core/decorators/current-user.decorator';
import { CurrentLand } from '@core/decorators/current-land.decorator';

import { CreateFishInventoryUseCase } from '../application/usecases/create-fish-inventory.usecase';
import { SaleFishInventoryUseCase } from '../application/usecases/sale-fish-inventory.usecase';
import { ListFishIventoriesUseCase } from '../application/usecases/list-fish-inventories.usecase';

import { SaleFishInventoryDTO } from '../application/dtos/sale-fish-inventory.dto';
import { ListFishIventoriesDTO } from '../application/dtos/list-fish-inventories.dto';

import { FishInventoryOutput } from '../application/output/fish-inventory.output';
import { FishInventoryListPresenter, FishInventoryPresenter } from './fish-inventory.presenter';

@Controller('fishes/inventories')
export class FishInventoryController {
  public constructor(
    private readonly createFishInventoryUseCase: CreateFishInventoryUseCase.UseCase,
    private readonly saleFishInventoryUseCase: SaleFishInventoryUseCase.UseCase,
    private readonly listFishIventoriesUseCase: ListFishIventoriesUseCase.UseCase,
  ) {}

  private static fishInventoryToResponse(output: FishInventoryOutput): FishInventoryPresenter {
    return new FishInventoryPresenter(output);
  }

  private static listFishInventoriesToResponse(
    output: ListFishIventoriesUseCase.Output,
  ): FishInventoryListPresenter {
    return new FishInventoryListPresenter(output);
  }

  @UseGuards(JwtGuard)
  @HttpCode(201)
  @Post()
  public async create(
    @CurrentUser('id') userId: string,
    @CurrentLand() landId: string,
  ): Promise<FishInventoryPresenter> {
    const output = await this.createFishInventoryUseCase.execute({
      userId,
      landId,
    });
    return FishInventoryController.fishInventoryToResponse(output);
  }

  @UseGuards(JwtGuard)
  @HttpCode(200)
  @Post('sale/:id')
  public async sale(
    @CurrentUser('id') userId: string,
    @CurrentLand() landId: string,
    @Param('id') id: string,
    @Body() data: SaleFishInventoryDTO,
  ): Promise<FishInventoryPresenter> {
    const output = await this.saleFishInventoryUseCase.execute({
      id,
      userId,
      landId,
      ...data,
    });
    return FishInventoryController.fishInventoryToResponse(output);
  }

  @UseGuards(JwtGuard)
  @HttpCode(200)
  @Get()
  public async list(
    @CurrentUser('id') userId: string,
    @CurrentLand() landId: string,
    @Query() searchParams: ListFishIventoriesDTO,
  ): Promise<FishInventoryListPresenter> {
    const output = await this.listFishIventoriesUseCase.execute({
      userId,
      landId,
      ...searchParams,
    });
    return FishInventoryController.listFishInventoriesToResponse(output);
  }
}
