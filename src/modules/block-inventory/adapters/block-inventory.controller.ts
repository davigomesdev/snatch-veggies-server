import { Body, Controller, Get, HttpCode, Param, Post, Query, UseGuards } from '@nestjs/common';

import { JwtGuard } from '@application/guards/jwt-guard';

import { CurrentUser } from '@core/decorators/current-user.decorator';
import { CurrentLand } from '@core/decorators/current-land.decorator';

import { CreateBlockInventoryUseCase } from '../application/usecases/create-block-inventory.usecase';
import { FindBlockIventoryUseCase } from '../application/usecases/find-block-inventory.usecase';
import { ListBlockIventoriesUseCase } from '../application/usecases/list-block-inventories.usecase';

import { CreateBlockInventoryDTO } from '../application/dtos/create-block-inventory.dto';
import { FindBlockIventoryDTO } from '../application/dtos/find-block-inventory.dto';
import { ListBlockIventoriesDTO } from '../application/dtos/list-block-inventories.dto';

import { BlockInventoryOutput } from '../application/output/block-inventory.output';
import { BlockInventoryListPresenter, BlockInventoryPresenter } from './block-inventory.presenter';

@Controller('blocks/inventories')
export class BlockInventoryController {
  public constructor(
    private readonly createBlockInventoryUseCase: CreateBlockInventoryUseCase.UseCase,
    private readonly findBlockIventoryUseCase: FindBlockIventoryUseCase.UseCase,
    private readonly listBlockIventoriesUseCase: ListBlockIventoriesUseCase.UseCase,
  ) {}

  private static blockInventoryToResponse(output: BlockInventoryOutput): BlockInventoryPresenter {
    return new BlockInventoryPresenter(output);
  }

  private static listBlockInventoriesToResponse(
    output: ListBlockIventoriesUseCase.Output,
  ): BlockInventoryListPresenter {
    return new BlockInventoryListPresenter(output);
  }

  @UseGuards(JwtGuard)
  @HttpCode(201)
  @Post()
  public async create(
    @CurrentUser('id') userId: string,
    @CurrentLand() landId: string,
    @Body() data: CreateBlockInventoryDTO,
  ): Promise<BlockInventoryPresenter> {
    const output = await this.createBlockInventoryUseCase.execute({
      userId,
      landId,
      ...data,
    });
    return BlockInventoryController.blockInventoryToResponse(output);
  }

  @UseGuards(JwtGuard)
  @HttpCode(200)
  @Get(':blockId')
  public async find(
    @CurrentUser('id') userId: string,
    @CurrentLand() landId: string,
    @Param('blockId') blockId: string,
    @Query() searchParams: FindBlockIventoryDTO,
  ): Promise<BlockInventoryPresenter> {
    const output = await this.findBlockIventoryUseCase.execute({
      userId,
      landId,
      blockId,
      ...searchParams,
    });
    return BlockInventoryController.blockInventoryToResponse(output);
  }

  @UseGuards(JwtGuard)
  @HttpCode(200)
  @Get()
  public async list(
    @CurrentUser('id') userId: string,
    @CurrentLand() landId: string,
    @Query() searchParams: ListBlockIventoriesDTO,
  ): Promise<BlockInventoryListPresenter> {
    const output = await this.listBlockIventoriesUseCase.execute({
      userId,
      landId,
      ...searchParams,
    });
    return BlockInventoryController.listBlockInventoriesToResponse(output);
  }
}
