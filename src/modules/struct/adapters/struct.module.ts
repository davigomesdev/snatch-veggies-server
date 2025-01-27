import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { JwtAuthModule } from '@infrastructure/jwt-auth/jwt-auth.module';
import { UploadModule } from '@infrastructure/upload/upload.module';

import { UploadService } from '@infrastructure/upload/upload.service';

import { StructController } from './struct.controller';

import { StructSchema } from '../infrastructure/mongo/struct-mongo.schema';
import { StructRepository } from '../domain/struct.repository';
import { StructMongoRepository } from '../infrastructure/mongo/struct-mongo.repository';

import { CreateStructUseCase } from '../application/usecases/create-struct.usecase';
import { UpdateStructUseCase } from '../application/usecases/update-struct.usecase';
import { UpdateStructImageUseCase } from '../application/usecases/update-struct-image.usecase';
import { UpdateStructItemImageUseCase } from '../application/usecases/update-struct-item-image.usecase';
import { FindStructUseCase } from '../application/usecases/find-struct.usecase';
import { ListStructsUseCase } from '../application/usecases/list-structs.usecase';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'struct', schema: StructSchema }]),
    JwtAuthModule,
    UploadModule,
  ],
  controllers: [StructController],
  providers: [
    {
      provide: 'StructRepository',
      useClass: StructMongoRepository,
    },
    {
      provide: CreateStructUseCase.UseCase,
      useFactory: (
        structRepository: StructRepository.Repository,
        uploadService: UploadService,
      ): CreateStructUseCase.UseCase => {
        return new CreateStructUseCase.UseCase(structRepository, uploadService);
      },
      inject: ['StructRepository', UploadService],
    },
    {
      provide: UpdateStructUseCase.UseCase,
      useFactory: (structRepository: StructRepository.Repository): UpdateStructUseCase.UseCase => {
        return new UpdateStructUseCase.UseCase(structRepository);
      },
      inject: ['StructRepository'],
    },
    {
      provide: UpdateStructImageUseCase.UseCase,
      useFactory: (
        structRepository: StructRepository.Repository,
        uploadService: UploadService,
      ): UpdateStructImageUseCase.UseCase => {
        return new UpdateStructImageUseCase.UseCase(structRepository, uploadService);
      },
      inject: ['StructRepository', UploadService],
    },
    {
      provide: UpdateStructItemImageUseCase.UseCase,
      useFactory: (
        structRepository: StructRepository.Repository,
        uploadService: UploadService,
      ): UpdateStructItemImageUseCase.UseCase => {
        return new UpdateStructItemImageUseCase.UseCase(structRepository, uploadService);
      },
      inject: ['StructRepository', UploadService],
    },
    {
      provide: FindStructUseCase.UseCase,
      useFactory: (StructRepository: StructRepository.Repository): FindStructUseCase.UseCase => {
        return new FindStructUseCase.UseCase(StructRepository);
      },
      inject: ['StructRepository'],
    },
    {
      provide: ListStructsUseCase.UseCase,
      useFactory: (StructRepository: StructRepository.Repository): ListStructsUseCase.UseCase => {
        return new ListStructsUseCase.UseCase(StructRepository);
      },
      inject: ['StructRepository'],
    },
  ],
})
export class StructModule {}
