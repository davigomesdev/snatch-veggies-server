import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { JwtAuthModule } from '@infrastructure/jwt-auth/jwt-auth.module';
import { UploadModule } from '@infrastructure/upload/upload.module';

import { UploadService } from '@infrastructure/upload/upload.service';

import { FishController } from './fish.controller';

import { FishSchema } from '../infrastructure/mongo/fish-mongo.schema';
import { FishRepository } from '../domain/fish.repository';
import { FishMongoRepository } from '../infrastructure/mongo/fish-mongo.repository';

import { CreateFishUseCase } from '../application/usecases/create-fish.usecase';
import { UpdateFishUseCase } from '../application/usecases/update-fish.usecase';
import { UpdateFishImageUseCase } from '../application/usecases/update-fish-image.usecase';
import { ListFishesUseCase } from '../application/usecases/list-fishes.usecase';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'fish', schema: FishSchema }]),
    JwtAuthModule,
    UploadModule,
  ],
  controllers: [FishController],
  providers: [
    {
      provide: 'FishRepository',
      useClass: FishMongoRepository,
    },
    {
      provide: CreateFishUseCase.UseCase,
      useFactory: (
        fishRepository: FishRepository.Repository,
        uploadService: UploadService,
      ): CreateFishUseCase.UseCase => {
        return new CreateFishUseCase.UseCase(fishRepository, uploadService);
      },
      inject: ['FishRepository', UploadService],
    },
    {
      provide: UpdateFishUseCase.UseCase,
      useFactory: (fishRepository: FishRepository.Repository): UpdateFishUseCase.UseCase => {
        return new UpdateFishUseCase.UseCase(fishRepository);
      },
      inject: ['FishRepository'],
    },
    {
      provide: UpdateFishImageUseCase.UseCase,
      useFactory: (
        fishRepository: FishRepository.Repository,
        uploadService: UploadService,
      ): UpdateFishImageUseCase.UseCase => {
        return new UpdateFishImageUseCase.UseCase(fishRepository, uploadService);
      },
      inject: ['FishRepository', UploadService],
    },
    {
      provide: ListFishesUseCase.UseCase,
      useFactory: (fishRepository: FishRepository.Repository): ListFishesUseCase.UseCase => {
        return new ListFishesUseCase.UseCase(fishRepository);
      },
      inject: ['FishRepository'],
    },
  ],
})
export class FishModule {}
