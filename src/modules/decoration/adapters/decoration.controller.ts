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

import { CreateDecorationUseCase } from '../application/usecases/create-decoration.usecase';
import { UpdateDecorationUseCase } from '../application/usecases/update-decoration.usecase';
import { UpdateDecorationImageUseCase } from '../application/usecases/update-decoration-image.usecase';
import { FindDecorationUseCase } from '../application/usecases/find-decoration.usecase';
import { ListDecorationsUseCase } from '../application/usecases/list-decorations.usecase';

import { CreateDecorationDTO } from '../application/dtos/create-decoration.dto';
import { UpdateDecorationDTO } from '../application/dtos/update-decoration.dto';
import { UpdateDecorationImageDTO } from '../application/dtos/update-decoration-image.dto';
import { FindDecorationDTO } from '../application/dtos/find-decoration.dto';
import { ListDecorationsDTO } from '../application/dtos/list-decorations.dto';

import { DecorationOutput } from '../application/output/decoration.output';
import { DecorationListPresenter, DecorationPresenter } from './decoration.presenter';

@Controller('decorations')
export class DecorationController {
  public constructor(
    private readonly createDecorationUseCase: CreateDecorationUseCase.UseCase,
    private readonly updateDecorationUseCase: UpdateDecorationUseCase.UseCase,
    private readonly updateDecorationImageUseCase: UpdateDecorationImageUseCase.UseCase,
    private readonly findDecorationUseCase: FindDecorationUseCase.UseCase,
    private readonly listDecorationsUseCase: ListDecorationsUseCase.UseCase,
  ) {}

  private static decorationToResponse(output: DecorationOutput): DecorationPresenter {
    return new DecorationPresenter(output);
  }

  private static listDecorationsToResponse(
    output: ListDecorationsUseCase.Output,
  ): DecorationListPresenter {
    return new DecorationListPresenter(output);
  }

  @HttpCode(201)
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  public async create(
    @Body() data: CreateDecorationDTO,
    @UploadedFile()
    image: File,
  ): Promise<DecorationPresenter> {
    const output = await this.createDecorationUseCase.execute({
      ...data,
      image,
    });
    return DecorationController.decorationToResponse(output);
  }

  @HttpCode(200)
  @Put(':id')
  public async update(
    @Param('id') id: string,
    @Body() data: UpdateDecorationDTO,
  ): Promise<DecorationPresenter> {
    const output = await this.updateDecorationUseCase.execute({
      id,
      ...data,
    });
    return DecorationController.decorationToResponse(output);
  }

  @HttpCode(201)
  @Post('image')
  @UseInterceptors(FileInterceptor('image'))
  public async updateImage(
    @Body() data: UpdateDecorationImageDTO,
    @UploadedFile()
    image: File,
  ): Promise<DecorationPresenter> {
    const output = await this.updateDecorationImageUseCase.execute({
      ...data,
      image,
    });
    return DecorationController.decorationToResponse(output);
  }

  @HttpCode(200)
  @Get(':id')
  public async find(
    @Param('id') id: string,
    @Query() searchParams: FindDecorationDTO,
  ): Promise<DecorationPresenter> {
    const output = await this.findDecorationUseCase.execute({
      id,
      ...searchParams,
    });
    return DecorationController.decorationToResponse(output);
  }

  @HttpCode(200)
  @Get()
  public async list(@Query() searchParams: ListDecorationsDTO): Promise<DecorationListPresenter> {
    const output = await this.listDecorationsUseCase.execute(searchParams);
    return DecorationController.listDecorationsToResponse(output);
  }
}
