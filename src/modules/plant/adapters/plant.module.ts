import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { JwtAuthModule } from '@infrastructure/jwt-auth/jwt-auth.module';
import { UploadModule } from '@infrastructure/upload/upload.module';

import { UploadService } from '@infrastructure/upload/upload.service';

import { PlantController } from './plant.controller';

import { PlantSchema } from '../infrastructure/mongo/plant-mongo.schema';
import { PlantRepository } from '../domain/plant.repository';
import { PlantMongoRepository } from '../infrastructure/mongo/plant-mongo.repository';

import { CreatePlantUseCase } from '../application/usecases/create-plant.usecase';
import { UpdatePlantUseCase } from '../application/usecases/update-plant.usecase';
import { UpdatePlantImageUseCase } from '../application/usecases/update-plant-image.usecase';
import { FindPlantUseCase } from '../application/usecases/find-plant.usecase';
import { ListPlantsUseCase } from '../application/usecases/list-plants.usecase';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'plant', schema: PlantSchema }]),
    JwtAuthModule,
    UploadModule,
  ],
  controllers: [PlantController],
  providers: [
    {
      provide: 'PlantRepository',
      useClass: PlantMongoRepository,
    },
    {
      provide: CreatePlantUseCase.UseCase,
      useFactory: (
        plantRepository: PlantRepository.Repository,
        uploadService: UploadService,
      ): CreatePlantUseCase.UseCase => {
        return new CreatePlantUseCase.UseCase(plantRepository, uploadService);
      },
      inject: ['PlantRepository', UploadService],
    },
    {
      provide: UpdatePlantUseCase.UseCase,
      useFactory: (plantRepository: PlantRepository.Repository): UpdatePlantUseCase.UseCase => {
        return new UpdatePlantUseCase.UseCase(plantRepository);
      },
      inject: ['PlantRepository'],
    },
    {
      provide: UpdatePlantImageUseCase.UseCase,
      useFactory: (
        plantRepository: PlantRepository.Repository,
        uploadService: UploadService,
      ): UpdatePlantImageUseCase.UseCase => {
        return new UpdatePlantImageUseCase.UseCase(plantRepository, uploadService);
      },
      inject: ['PlantRepository', UploadService],
    },
    {
      provide: FindPlantUseCase.UseCase,
      useFactory: (plantRepository: PlantRepository.Repository): FindPlantUseCase.UseCase => {
        return new FindPlantUseCase.UseCase(plantRepository);
      },
      inject: ['PlantRepository'],
    },
    {
      provide: ListPlantsUseCase.UseCase,
      useFactory: (plantRepository: PlantRepository.Repository): ListPlantsUseCase.UseCase => {
        return new ListPlantsUseCase.UseCase(plantRepository);
      },
      inject: ['PlantRepository'],
    },
  ],
})
export class PlantModule {}
