import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, File } from '@nest-lab/fastify-multer';

import { CreateFishUseCase } from '../application/usecases/create-fish.usecase';
import { UpdateFishUseCase } from '../application/usecases/update-fish.usecase';
import { UpdateFishImageUseCase } from '../application/usecases/update-fish-image.usecase';
import { ListFishesUseCase } from '../application/usecases/list-fishes.usecase';

import { CreateFishDTO } from '../application/dtos/create-fish.dto';
import { UpdateFishDTO } from '../application/dtos/update-fish.dto';
import { UpdateFishImageDTO } from '../application/dtos/update-fish-image.dto';

import { FishOutput } from '../application/output/fish.output';
import { FishListPresenter, FishPresenter } from './fish.presenter';

@Controller('fishes')
export class FishController {
  public constructor(
    private readonly createFishUseCase: CreateFishUseCase.UseCase,
    private readonly updateFishUseCase: UpdateFishUseCase.UseCase,
    private readonly updateFishImageUseCase: UpdateFishImageUseCase.UseCase,
    private readonly listFishesUseCase: ListFishesUseCase.UseCase,
  ) {}

  private static fishToResponse(output: FishOutput): FishPresenter {
    return new FishPresenter(output);
  }

  private static listFishesToResponse(output: ListFishesUseCase.Output): FishListPresenter {
    return new FishListPresenter(output);
  }

  @HttpCode(201)
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  public async create(
    @Body() data: CreateFishDTO,
    @UploadedFile()
    image: File,
  ): Promise<FishPresenter> {
    const output = await this.createFishUseCase.execute({
      ...data,
      image,
    });
    return FishController.fishToResponse(output);
  }

  @HttpCode(200)
  @Put(':id')
  public async update(
    @Param('id') id: string,
    @Body() data: UpdateFishDTO,
  ): Promise<FishPresenter> {
    const output = await this.updateFishUseCase.execute({
      id,
      ...data,
    });
    return FishController.fishToResponse(output);
  }

  @HttpCode(201)
  @Post('image')
  @UseInterceptors(FileInterceptor('image'))
  public async updateImage(
    @Body() data: UpdateFishImageDTO,
    @UploadedFile()
    image: File,
  ): Promise<FishPresenter> {
    const output = await this.updateFishImageUseCase.execute({
      ...data,
      image,
    });
    return FishController.fishToResponse(output);
  }

  @HttpCode(200)
  @Get()
  public async list(): Promise<FishListPresenter> {
    const output = await this.listFishesUseCase.execute();
    return FishController.listFishesToResponse(output);
  }
}
