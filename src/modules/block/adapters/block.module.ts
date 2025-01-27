import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { JwtAuthModule } from '@infrastructure/jwt-auth/jwt-auth.module';
import { UploadModule } from '@infrastructure/upload/upload.module';

import { UploadService } from '@infrastructure/upload/upload.service';

import { BlockController } from './block.controller';

import { BlockSchema } from '../infrastructure/mongo/block-mongo.schema';
import { BlockRepository } from '../domain/block.repository';
import { BlockMongoRepository } from '../infrastructure/mongo/block-mongo.repository';

import { CreateBlockUseCase } from '../application/usecases/create-block.usecase';
import { UpdateBlockUseCase } from '../application/usecases/update-block.usecase';
import { UpdateBlockImageUseCase } from '../application/usecases/update-block-image.usecase';
import { FindBlockUseCase } from '../application/usecases/find-block.usecase';
import { ListBlocksUseCase } from '../application/usecases/list-blocks.usecase';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'block', schema: BlockSchema }]),
    JwtAuthModule,
    UploadModule,
  ],
  controllers: [BlockController],
  providers: [
    {
      provide: 'BlockRepository',
      useClass: BlockMongoRepository,
    },
    {
      provide: CreateBlockUseCase.UseCase,
      useFactory: (
        blockRepository: BlockRepository.Repository,
        uploadService: UploadService,
      ): CreateBlockUseCase.UseCase => {
        return new CreateBlockUseCase.UseCase(blockRepository, uploadService);
      },
      inject: ['BlockRepository', UploadService],
    },
    {
      provide: UpdateBlockUseCase.UseCase,
      useFactory: (blockRepository: BlockRepository.Repository): UpdateBlockUseCase.UseCase => {
        return new UpdateBlockUseCase.UseCase(blockRepository);
      },
      inject: ['BlockRepository'],
    },
    {
      provide: UpdateBlockImageUseCase.UseCase,
      useFactory: (
        blockRepository: BlockRepository.Repository,
        uploadService: UploadService,
      ): UpdateBlockImageUseCase.UseCase => {
        return new UpdateBlockImageUseCase.UseCase(blockRepository, uploadService);
      },
      inject: ['BlockRepository', UploadService],
    },
    {
      provide: FindBlockUseCase.UseCase,
      useFactory: (blockRepository: BlockRepository.Repository): FindBlockUseCase.UseCase => {
        return new FindBlockUseCase.UseCase(blockRepository);
      },
      inject: ['BlockRepository'],
    },
    {
      provide: ListBlocksUseCase.UseCase,
      useFactory: (blockRepository: BlockRepository.Repository): ListBlocksUseCase.UseCase => {
        return new ListBlocksUseCase.UseCase(blockRepository);
      },
      inject: ['BlockRepository'],
    },
  ],
})
export class BlockModule {}
