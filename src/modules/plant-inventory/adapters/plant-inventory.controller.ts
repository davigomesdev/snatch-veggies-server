import { Body, Controller, Get, HttpCode, Param, Post, Query, UseGuards } from '@nestjs/common';

import { JwtGuard } from '@application/guards/jwt-guard';

import { CurrentUser } from '@core/decorators/current-user.decorator';
import { CurrentLand } from '@core/decorators/current-land.decorator';

import { CreatePlantInventoryUseCase } from '../application/usecases/create-plant-inventory.usecase';
import { SalePlantInventoryUseCase } from '../application/usecases/sale-plant-inventory.usecase';
import { ListPlantIventoriesUseCase } from '../application/usecases/list-plant-inventories.usecase';

import { CreatePlantInventoryDTO } from '../application/dtos/create-plant-inventory.dto';
import { SalePlantInventoryDTO } from '../application/dtos/sale-plant-inventory.dto';
import { FindPlantIventoryUseCase } from '../application/usecases/find-plant-inventory.usecase';
import { ListPlantIventoriesDTO } from '../application/dtos/list-plant-inventories.dto';

import { PlantInventoryOutput } from '../application/output/plant-inventory.output';
import { PlantInventoryListPresenter, PlantInventoryPresenter } from './plant-inventory.presenter';
import { FindPlantIventoryDTO } from '../application/dtos/find-plant-inventory.dto';

@Controller('plants/inventories')
export class PlantInventoryController {
  public constructor(
    private readonly createPlantInventoryUseCase: CreatePlantInventoryUseCase.UseCase,
    private readonly salePlantInventoryUseCase: SalePlantInventoryUseCase.UseCase,
    private readonly findPlantIventoryUseCase: FindPlantIventoryUseCase.UseCase,
    private readonly listPlantIventoriesUseCase: ListPlantIventoriesUseCase.UseCase,
  ) {}

  private static plantInventoryToResponse(output: PlantInventoryOutput): PlantInventoryPresenter {
    return new PlantInventoryPresenter(output);
  }

  private static listPlantInventoriesToResponse(
    output: ListPlantIventoriesUseCase.Output,
  ): PlantInventoryListPresenter {
    return new PlantInventoryListPresenter(output);
  }

  @UseGuards(JwtGuard)
  @HttpCode(201)
  @Post()
  public async create(
    @CurrentUser('id') userId: string,
    @CurrentLand() landId: string,
    @Body() data: CreatePlantInventoryDTO,
  ): Promise<PlantInventoryPresenter> {
    const output = await this.createPlantInventoryUseCase.execute({
      userId,
      landId,
      ...data,
    });
    return PlantInventoryController.plantInventoryToResponse(output);
  }

  @UseGuards(JwtGuard)
  @HttpCode(200)
  @Post('sale/:id')
  public async sale(
    @CurrentUser('id') userId: string,
    @CurrentLand() landId: string,
    @Param('id') id: string,
    @Body() data: SalePlantInventoryDTO,
  ): Promise<PlantInventoryPresenter> {
    const output = await this.salePlantInventoryUseCase.execute({
      id,
      userId,
      landId,
      ...data,
    });
    return PlantInventoryController.plantInventoryToResponse(output);
  }

  @UseGuards(JwtGuard)
  @HttpCode(200)
  @Get(':plantId')
  public async find(
    @CurrentUser('id') userId: string,
    @CurrentLand() landId: string,
    @Param('plantId') plantId: string,
    @Query() searchParams: FindPlantIventoryDTO,
  ): Promise<PlantInventoryPresenter> {
    const output = await this.findPlantIventoryUseCase.execute({
      userId,
      landId,
      plantId,
      ...searchParams,
    });
    return PlantInventoryController.plantInventoryToResponse(output);
  }

  @UseGuards(JwtGuard)
  @HttpCode(200)
  @Get()
  public async list(
    @CurrentUser('id') userId: string,
    @CurrentLand() landId: string,
    @Query() searchParams: ListPlantIventoriesDTO,
  ): Promise<PlantInventoryListPresenter> {
    const output = await this.listPlantIventoriesUseCase.execute({
      userId,
      landId,
      ...searchParams,
    });
    return PlantInventoryController.listPlantInventoriesToResponse(output);
  }
}
