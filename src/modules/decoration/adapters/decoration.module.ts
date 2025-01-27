import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { JwtAuthModule } from '@infrastructure/jwt-auth/jwt-auth.module';
import { UploadModule } from '@infrastructure/upload/upload.module';

import { UploadService } from '@infrastructure/upload/upload.service';

import { DecorationController } from './decoration.controller';

import { DecorationSchema } from '../infrastructure/mongo/decoration-mongo.schema';
import { DecorationRepository } from '../domain/decoration.repository';
import { DecorationMongoRepository } from '../infrastructure/mongo/decoration-mongo.repository';

import { CreateDecorationUseCase } from '../application/usecases/create-decoration.usecase';
import { UpdateDecorationUseCase } from '../application/usecases/update-decoration.usecase';
import { UpdateDecorationImageUseCase } from '../application/usecases/update-decoration-image.usecase';
import { FindDecorationUseCase } from '../application/usecases/find-decoration.usecase';
import { ListDecorationsUseCase } from '../application/usecases/list-decorations.usecase';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'decoration', schema: DecorationSchema }]),
    JwtAuthModule,
    UploadModule,
  ],
  controllers: [DecorationController],
  providers: [
    {
      provide: 'DecorationRepository',
      useClass: DecorationMongoRepository,
    },
    {
      provide: CreateDecorationUseCase.UseCase,
      useFactory: (
        decorationRepository: DecorationRepository.Repository,
        uploadService: UploadService,
      ): CreateDecorationUseCase.UseCase => {
        return new CreateDecorationUseCase.UseCase(decorationRepository, uploadService);
      },
      inject: ['DecorationRepository', UploadService],
    },
    {
      provide: UpdateDecorationUseCase.UseCase,
      useFactory: (
        decorationRepository: DecorationRepository.Repository,
      ): UpdateDecorationUseCase.UseCase => {
        return new UpdateDecorationUseCase.UseCase(decorationRepository);
      },
      inject: ['DecorationRepository'],
    },
    {
      provide: UpdateDecorationImageUseCase.UseCase,
      useFactory: (
        decorationRepository: DecorationRepository.Repository,
        uploadService: UploadService,
      ): UpdateDecorationImageUseCase.UseCase => {
        return new UpdateDecorationImageUseCase.UseCase(decorationRepository, uploadService);
      },
      inject: ['DecorationRepository', UploadService],
    },
    {
      provide: FindDecorationUseCase.UseCase,
      useFactory: (
        decorationRepository: DecorationRepository.Repository,
      ): FindDecorationUseCase.UseCase => {
        return new FindDecorationUseCase.UseCase(decorationRepository);
      },
      inject: ['DecorationRepository'],
    },
    {
      provide: ListDecorationsUseCase.UseCase,
      useFactory: (
        decorationRepository: DecorationRepository.Repository,
      ): ListDecorationsUseCase.UseCase => {
        return new ListDecorationsUseCase.UseCase(decorationRepository);
      },
      inject: ['DecorationRepository'],
    },
  ],
})
export class DecorationModule {}
