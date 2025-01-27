import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, File } from '@nest-lab/fastify-multer';

import { CreateBlockUseCase } from '../application/usecases/create-block.usecase';
import { UpdateBlockUseCase } from '../application/usecases/update-block.usecase';
import { UpdateBlockImageUseCase } from '../application/usecases/update-block-image.usecase';
import { FindBlockUseCase } from '../application/usecases/find-block.usecase';
import { ListBlocksUseCase } from '../application/usecases/list-blocks.usecase';

import { CreateBlockDTO } from '../application/dtos/create-block.dto';
import { UpdateBlockDTO } from '../application/dtos/update-block.dto';
import { UpdateBlockImageDTO } from '../application/dtos/update-block-image.dto';
import { ListBlocksDTO } from '../application/dtos/list-blocks.dto';

import { BlockOutput } from '../application/output/block.output';
import { BlockListPresenter, BlockPresenter } from './block.presenter';
import { FindBlockDTO } from '../application/dtos/find-block.dto';

@Controller('blocks')
export class BlockController {
  public constructor(
    private readonly createBlockUseCase: CreateBlockUseCase.UseCase,
    private readonly updateBlockUseCase: UpdateBlockUseCase.UseCase,
    private readonly updateBlockImageUseCase: UpdateBlockImageUseCase.UseCase,
    private readonly findBlockUseCase: FindBlockUseCase.UseCase,
    private readonly listBlocksUseCase: ListBlocksUseCase.UseCase,
  ) {}

  private static blockToResponse(output: BlockOutput): BlockPresenter {
    return new BlockPresenter(output);
  }

  private static listBlocksToResponse(output: ListBlocksUseCase.Output): BlockListPresenter {
    return new BlockListPresenter(output);
  }

  @HttpCode(201)
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  public async create(
    @Body() data: CreateBlockDTO,
    @UploadedFile()
    image: File,
  ): Promise<BlockPresenter> {
    const output = await this.createBlockUseCase.execute({
      ...data,
      image,
    });
    return BlockController.blockToResponse(output);
  }

  @HttpCode(200)
  @Put(':id')
  public async update(
    @Param('id') id: string,
    @Body() data: UpdateBlockDTO,
  ): Promise<BlockPresenter> {
    const output = await this.updateBlockUseCase.execute({
      id,
      ...data,
    });
    return BlockController.blockToResponse(output);
  }

  @HttpCode(201)
  @Post('image')
  @UseInterceptors(FileInterceptor('image'))
  public async updateImage(
    @Body() data: UpdateBlockImageDTO,
    @UploadedFile()
    image: File,
  ): Promise<BlockPresenter> {
    const output = await this.updateBlockImageUseCase.execute({
      ...data,
      image,
    });
    return BlockController.blockToResponse(output);
  }

  @HttpCode(200)
  @Get(':id')
  public async find(
    @Param('id') id: string,
    @Query() searchParams: FindBlockDTO,
  ): Promise<BlockPresenter> {
    const output = await this.findBlockUseCase.execute({
      id,
      ...searchParams,
    });
    return BlockController.blockToResponse(output);
  }

  @HttpCode(200)
  @Get()
  public async list(@Query() searchParams: ListBlocksDTO): Promise<BlockListPresenter> {
    const output = await this.listBlocksUseCase.execute(searchParams);
    return BlockController.listBlocksToResponse(output);
  }
}
