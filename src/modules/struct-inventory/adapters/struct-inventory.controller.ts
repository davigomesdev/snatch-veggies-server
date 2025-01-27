import { Body, Controller, Get, HttpCode, Param, Post, Query, UseGuards } from '@nestjs/common';

import { JwtGuard } from '@application/guards/jwt-guard';

import { CurrentUser } from '@core/decorators/current-user.decorator';
import { CurrentLand } from '@core/decorators/current-land.decorator';

import { CreateStructInventoryUseCase } from '../application/usecases/create-struct-inventory.usecase';
import { SaleStructInventoryUseCase } from '../application/usecases/sale-struct-inventory.usecase';
import { FindStructIventoryUseCase } from '../application/usecases/find-struct-inventory.usecase';
import { ListStructIventoriesUseCase } from '../application/usecases/list-struct-inventories.usecase';

import { CreateStructInventoryDTO } from '../application/dtos/create-struct-inventory.dto';
import { SaleStructInventoryDTO } from '../application/dtos/sale-struct-inventory.dto';
import { FindStructIventoryDTO } from '../application/dtos/find-struct-inventory.dto';
import { ListStructIventoriesDTO } from '../application/dtos/list-struct-inventories.dto';

import { StructInventoryOutput } from '../application/output/struct-inventory.output';
import {
  StructInventoryListPresenter,
  StructInventoryPresenter,
} from './struct-inventory.presenter';

@Controller('structs/inventories')
export class StructInventoryController {
  public constructor(
    private readonly createStructInventoryUseCase: CreateStructInventoryUseCase.UseCase,
    private readonly saleStructInventoryUseCase: SaleStructInventoryUseCase.UseCase,
    private readonly findStructIventoryUseCase: FindStructIventoryUseCase.UseCase,
    private readonly listStructIventoriesUseCase: ListStructIventoriesUseCase.UseCase,
  ) {}

  private static structInventoryToResponse(
    output: StructInventoryOutput,
  ): StructInventoryPresenter {
    return new StructInventoryPresenter(output);
  }

  private static listStructInventoriesToResponse(
    output: ListStructIventoriesUseCase.Output,
  ): StructInventoryListPresenter {
    return new StructInventoryListPresenter(output);
  }

  @UseGuards(JwtGuard)
  @HttpCode(201)
  @Post()
  public async create(
    @CurrentUser('id') userId: string,
    @CurrentLand() landId: string,
    @Body() data: CreateStructInventoryDTO,
  ): Promise<StructInventoryPresenter> {
    const output = await this.createStructInventoryUseCase.execute({
      userId,
      landId,
      ...data,
    });
    return StructInventoryController.structInventoryToResponse(output);
  }

  @UseGuards(JwtGuard)
  @HttpCode(200)
  @Post('sale/:id')
  public async sale(
    @CurrentUser('id') userId: string,
    @CurrentLand() landId: string,
    @Param('id') id: string,
    @Body() data: SaleStructInventoryDTO,
  ): Promise<StructInventoryPresenter> {
    const output = await this.saleStructInventoryUseCase.execute({
      id,
      userId,
      landId,
      ...data,
    });
    return StructInventoryController.structInventoryToResponse(output);
  }

  @UseGuards(JwtGuard)
  @HttpCode(200)
  @Get(':structId')
  public async find(
    @CurrentUser('id') userId: string,
    @CurrentLand() landId: string,
    @Param('structId') structId: string,
    @Query() searchParams: FindStructIventoryDTO,
  ): Promise<StructInventoryPresenter> {
    const output = await this.findStructIventoryUseCase.execute({
      userId,
      landId,
      structId,
      ...searchParams,
    });
    return StructInventoryController.structInventoryToResponse(output);
  }

  @UseGuards(JwtGuard)
  @HttpCode(200)
  @Get()
  public async list(
    @CurrentUser('id') userId: string,
    @CurrentLand() landId: string,
    @Query() searchParams: ListStructIventoriesDTO,
  ): Promise<StructInventoryListPresenter> {
    const output = await this.listStructIventoriesUseCase.execute({
      userId,
      landId,
      ...searchParams,
    });
    return StructInventoryController.listStructInventoriesToResponse(output);
  }
}
