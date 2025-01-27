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

import { CreatePlantUseCase } from '../application/usecases/create-plant.usecase';
import { UpdatePlantUseCase } from '../application/usecases/update-plant.usecase';
import { UpdatePlantImageUseCase } from '../application/usecases/update-plant-image.usecase';
import { FindPlantUseCase } from '../application/usecases/find-plant.usecase';
import { ListPlantsUseCase } from '../application/usecases/list-plants.usecase';

import { CreatePlantDTO } from '../application/dtos/create-plant.dto';
import { UpdatePlantDTO } from '../application/dtos/update-plant.dto';
import { UpdatePlantImageDTO } from '../application/dtos/update-plant-image.dto';
import { FindPlantDTO } from '../application/dtos/find-plant.dto';
import { ListPlantsDTO } from '../application/dtos/list-plants.dto';

import { PlantOutput } from '../application/output/plant.output';
import { PlantListPresenter, PlantPresenter } from './plant.presenter';

@Controller('plants')
export class PlantController {
  public constructor(
    private readonly createPlantUseCase: CreatePlantUseCase.UseCase,
    private readonly updatePlantUseCase: UpdatePlantUseCase.UseCase,
    private readonly updatePlantImageUseCase: UpdatePlantImageUseCase.UseCase,
    private readonly findPlantUseCase: FindPlantUseCase.UseCase,
    private readonly listPlantsUseCase: ListPlantsUseCase.UseCase,
  ) {}

  private static plantToResponse(output: PlantOutput): PlantPresenter {
    return new PlantPresenter(output);
  }

  private static listPlantsToResponse(output: ListPlantsUseCase.Output): PlantListPresenter {
    return new PlantListPresenter(output);
  }

  @HttpCode(201)
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  public async create(
    @Body() data: CreatePlantDTO,
    @UploadedFile()
    image: File,
  ): Promise<PlantPresenter> {
    const output = await this.createPlantUseCase.execute({
      ...data,
      image,
    });
    return PlantController.plantToResponse(output);
  }

  @HttpCode(200)
  @Put(':id')
  public async update(
    @Param('id') id: string,
    @Body() data: UpdatePlantDTO,
  ): Promise<PlantPresenter> {
    const output = await this.updatePlantUseCase.execute({
      id,
      ...data,
    });
    return PlantController.plantToResponse(output);
  }

  @HttpCode(201)
  @Post('image')
  @UseInterceptors(FileInterceptor('image'))
  public async updateImage(
    @Body() data: UpdatePlantImageDTO,
    @UploadedFile()
    image: File,
  ): Promise<PlantPresenter> {
    const output = await this.updatePlantImageUseCase.execute({
      ...data,
      image,
    });
    return PlantController.plantToResponse(output);
  }

  @HttpCode(200)
  @Get(':id')
  public async find(
    @Param('id') id: string,
    @Query() searchParams: FindPlantDTO,
  ): Promise<PlantPresenter> {
    const output = await this.findPlantUseCase.execute({
      id,
      ...searchParams,
    });
    return PlantController.plantToResponse(output);
  }

  @HttpCode(200)
  @Get()
  public async list(@Query() searchParams: ListPlantsDTO): Promise<PlantListPresenter> {
    const output = await this.listPlantsUseCase.execute(searchParams);
    return PlantController.listPlantsToResponse(output);
  }
}
