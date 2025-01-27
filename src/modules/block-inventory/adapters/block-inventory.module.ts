import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { JwtAuthModule } from '@infrastructure/jwt-auth/jwt-auth.module';

import { BlockInventoryController } from './block-inventory.controller';

import { BlockInventorySchema } from '../infrastructure/mongo/block-inventory-mongo.schema';
import { BlockInventoryRepository } from '../domain/block-inventory.repository';
import { BlockInventoryMongoRepository } from '../infrastructure/mongo/block-inventory-mongo.repository';

import { UserSchema } from '@modules/user/infrastructure/mongo/user-mongo.schema';
import { UserRepository } from '@modules/user/domain/user.repository';
import { UserMongoRepository } from '@modules/user/infrastructure/mongo/user-mongo.repository';

import { LandSchema } from '@modules/land/infrastructure/mongo/land-mongo.schema';
import { LandRepository } from '@modules/land/domain/land.repository';
import { LandMongoRepository } from '@modules/land/infrastructure/mongo/land-mongo.repository';

import { BlockSchema } from '@modules/block/infrastructure/mongo/block-mongo.schema';
import { BlockRepository } from '@modules/block/domain/block.repository';
import { BlockMongoRepository } from '@modules/block/infrastructure/mongo/block-mongo.repository';

import { CreateBlockInventoryUseCase } from '../application/usecases/create-block-inventory.usecase';
import { FindBlockIventoryUseCase } from '../application/usecases/find-block-inventory.usecase';
import { ListBlockIventoriesUseCase } from '../application/usecases/list-block-inventories.usecase';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'blockInventory', schema: BlockInventorySchema },
      { name: 'user', schema: UserSchema },
      { name: 'land', schema: LandSchema },
      { name: 'block', schema: BlockSchema },
    ]),
    JwtAuthModule,
  ],
  controllers: [BlockInventoryController],
  providers: [
    {
      provide: 'BlockInventoryRepository',
      useClass: BlockInventoryMongoRepository,
    },
    {
      provide: 'UserRepository',
      useClass: UserMongoRepository,
    },
    {
      provide: 'LandRepository',
      useClass: LandMongoRepository,
    },
    {
      provide: 'BlockRepository',
      useClass: BlockMongoRepository,
    },
    {
      provide: CreateBlockInventoryUseCase.UseCase,
      useFactory: (
        blockInventoryRepository: BlockInventoryRepository.Repository,
        userRepository: UserRepository.Repository,
        landRepository: LandRepository.Repository,
        blockRepository: BlockRepository.Repository,
      ): CreateBlockInventoryUseCase.UseCase => {
        return new CreateBlockInventoryUseCase.UseCase(
          blockInventoryRepository,
          userRepository,
          landRepository,
          blockRepository,
        );
      },
      inject: ['BlockInventoryRepository', 'UserRepository', 'LandRepository', 'BlockRepository'],
    },
    {
      provide: FindBlockIventoryUseCase.UseCase,
      useFactory: (
        blockInventoryRepository: BlockInventoryRepository.Repository,
      ): FindBlockIventoryUseCase.UseCase => {
        return new FindBlockIventoryUseCase.UseCase(blockInventoryRepository);
      },
      inject: ['BlockInventoryRepository'],
    },
    {
      provide: ListBlockIventoriesUseCase.UseCase,
      useFactory: (
        blockInventoryRepository: BlockInventoryRepository.Repository,
      ): ListBlockIventoriesUseCase.UseCase => {
        return new ListBlockIventoriesUseCase.UseCase(blockInventoryRepository);
      },
      inject: ['BlockInventoryRepository'],
    },
  ],
})
export class BlockInventoryModule {}
