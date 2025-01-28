import { Body, Controller, Get, HttpCode, Param, Post, Query, UseGuards } from '@nestjs/common';

import { JwtGuard } from '@application/guards/jwt-guard';

import { CurrentUser } from '@core/decorators/current-user.decorator';
import { CurrentLand } from '@core/decorators/current-land.decorator';

import { CreateDecorationInventoryUseCase } from '../application/usecases/create-decoration-inventory.usecase';
import { FindDecorationIventoryUseCase } from '../application/usecases/find-decoration-inventory.usecase';
import { ListDecorationIventoriesUseCase } from '../application/usecases/list-decoration-inventories.usecase';

import { CreateDecorationInventoryDTO } from '../application/dtos/create-decoration-inventory.dto';
import { ListDecorationIventoriesDTO } from '../application/dtos/list-decoration-inventories.dto';

import { DecorationInventoryOutput } from '../application/output/decoration-inventory.output';
import {
  DecorationInventoryListPresenter,
  DecorationInventoryPresenter,
} from './decoration-inventory.presenter';
import { FindDecorationIventoryDTO } from '../application/dtos/find-decoration-inventory.dto';

@Controller('decorations/inventories')
export class DecorationInventoryController {
  public constructor(
    private readonly createDecorationInventoryUseCase: CreateDecorationInventoryUseCase.UseCase,
    private readonly findDecorationIventoryUseCase: FindDecorationIventoryUseCase.UseCase,
    private readonly listDecorationIventoriesUseCase: ListDecorationIventoriesUseCase.UseCase,
  ) {}

  public static decorationInventoryToResponse(
    output: DecorationInventoryOutput,
  ): DecorationInventoryPresenter {
    return new DecorationInventoryPresenter(output);
  }

  public static listDecorationInventoriesToResponse(
    output: ListDecorationIventoriesUseCase.Output,
  ): DecorationInventoryListPresenter {
    return new DecorationInventoryListPresenter(output);
  }

  @UseGuards(JwtGuard)
  @HttpCode(201)
  @Post()
  public async create(
    @CurrentUser('id') userId: string,
    @CurrentLand() landId: string,
    @Body() data: CreateDecorationInventoryDTO,
  ): Promise<DecorationInventoryPresenter> {
    const output = await this.createDecorationInventoryUseCase.execute({
      userId,
      landId,
      ...data,
    });
    return DecorationInventoryController.decorationInventoryToResponse(output);
  }

  @UseGuards(JwtGuard)
  @HttpCode(200)
  @Get(':decorationId')
  public async find(
    @CurrentUser('id') userId: string,
    @CurrentLand() landId: string,
    @Param('decorationId') decorationId: string,
    @Query() searchParams: FindDecorationIventoryDTO,
  ): Promise<DecorationInventoryPresenter> {
    const output = await this.findDecorationIventoryUseCase.execute({
      userId,
      landId,
      decorationId,
      ...searchParams,
    });
    return DecorationInventoryController.decorationInventoryToResponse(output);
  }

  @UseGuards(JwtGuard)
  @HttpCode(200)
  @Get()
  public async list(
    @CurrentUser('id') userId: string,
    @CurrentLand() landId: string,
    @Query() searchParams: ListDecorationIventoriesDTO,
  ): Promise<DecorationInventoryListPresenter> {
    const output = await this.listDecorationIventoriesUseCase.execute({
      userId,
      landId,
      ...searchParams,
    });
    return DecorationInventoryController.listDecorationInventoriesToResponse(output);
  }
}
