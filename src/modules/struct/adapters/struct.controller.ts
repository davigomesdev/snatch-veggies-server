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

import { CreateStructUseCase } from '../application/usecases/create-struct.usecase';
import { UpdateStructUseCase } from '../application/usecases/update-struct.usecase';
import { UpdateStructImageUseCase } from '../application/usecases/update-struct-image.usecase';
import { UpdateStructItemImageUseCase } from '../application/usecases/update-struct-item-image.usecase';
import { FindStructUseCase } from '../application/usecases/find-struct.usecase';
import { ListStructsUseCase } from '../application/usecases/list-structs.usecase';

import { CreateStructDTO } from '../application/dtos/create-struct.dto';
import { UpdateStructDTO } from '../application/dtos/update-struct.dto';
import { UpdateStructImageDTO } from '../application/dtos/update-struct-image.dto';
import { UpdateStructItemImageDTO } from '../application/dtos/update-struct-item-image.dto';
import { ListStructsDTO } from '../application/dtos/list-structs.dto';

import { StructOutput } from '../application/output/struct.output';
import { StructListPresenter, StructPresenter } from './struct.presenter';
import { FindStructDTO } from '../application/dtos/find-struct.dto';

@Controller('structs')
export class StructController {
  public constructor(
    private readonly createStructUseCase: CreateStructUseCase.UseCase,
    private readonly updateStructUseCase: UpdateStructUseCase.UseCase,
    private readonly updateStructImageUseCase: UpdateStructImageUseCase.UseCase,
    private readonly updateStructItemImageUseCase: UpdateStructItemImageUseCase.UseCase,
    private readonly findStructUseCase: FindStructUseCase.UseCase,
    private readonly listStructsUseCase: ListStructsUseCase.UseCase,
  ) {}

  private static structToResponse(output: StructOutput): StructPresenter {
    return new StructPresenter(output);
  }

  private static listStructsToResponse(output: ListStructsUseCase.Output): StructListPresenter {
    return new StructListPresenter(output);
  }

  @HttpCode(201)
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  public async create(
    @Body() data: CreateStructDTO,
    @UploadedFile()
    image: File,
  ): Promise<StructPresenter> {
    const output = await this.createStructUseCase.execute({
      ...data,
      image,
    });
    return StructController.structToResponse(output);
  }

  @HttpCode(200)
  @Put(':id')
  public async update(
    @Param('id') id: string,
    @Body() data: UpdateStructDTO,
  ): Promise<StructPresenter> {
    const output = await this.updateStructUseCase.execute({
      id,
      ...data,
    });
    return StructController.structToResponse(output);
  }

  @HttpCode(200)
  @Post('image')
  @UseInterceptors(FileInterceptor('image'))
  public async updateImage(
    @Body() data: UpdateStructImageDTO,
    @UploadedFile()
    image: File,
  ): Promise<StructPresenter> {
    const output = await this.updateStructImageUseCase.execute({
      ...data,
      image,
    });
    return StructController.structToResponse(output);
  }

  @HttpCode(200)
  @Post('item/image')
  @UseInterceptors(FileInterceptor('image'))
  public async updateItemImage(
    @Body() data: UpdateStructItemImageDTO,
    @UploadedFile()
    image: File,
  ): Promise<StructPresenter> {
    const output = await this.updateStructItemImageUseCase.execute({
      ...data,
      image,
    });
    return StructController.structToResponse(output);
  }

  @HttpCode(200)
  @Get(':id')
  public async find(
    @Param('id') id: string,
    @Query() searchParams: FindStructDTO,
  ): Promise<StructPresenter> {
    const output = await this.findStructUseCase.execute({
      id,
      ...searchParams,
    });
    return StructController.structToResponse(output);
  }

  @HttpCode(200)
  @Get()
  public async list(@Query() searchParams: ListStructsDTO): Promise<StructListPresenter> {
    const output = await this.listStructsUseCase.execute(searchParams);
    return StructController.listStructsToResponse(output);
  }
}
