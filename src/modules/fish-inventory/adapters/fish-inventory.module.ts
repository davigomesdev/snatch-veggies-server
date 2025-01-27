import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { JwtAuthModule } from '@infrastructure/jwt-auth/jwt-auth.module';

import { FishInventoryController } from './fish-inventory.controller';

import { FishInventorySchema } from '../infrastructure/mongo/fish-inventory-mongo.schema';
import { FishInventoryRepository } from '../domain/fish-inventory.repository';
import { FishInventoryMongoRepository } from '../infrastructure/mongo/fish-inventory-mongo.repository';

import { UserSchema } from '@modules/user/infrastructure/mongo/user-mongo.schema';
import { UserRepository } from '@modules/user/domain/user.repository';
import { UserMongoRepository } from '@modules/user/infrastructure/mongo/user-mongo.repository';

import { LandSchema } from '@modules/land/infrastructure/mongo/land-mongo.schema';
import { LandRepository } from '@modules/land/domain/land.repository';
import { LandMongoRepository } from '@modules/land/infrastructure/mongo/land-mongo.repository';

import { FishSchema } from '@modules/fish/infrastructure/mongo/fish-mongo.schema';
import { FishRepository } from '@modules/fish/domain/fish.repository';
import { FishMongoRepository } from '@modules/fish/infrastructure/mongo/fish-mongo.repository';

import { CreateFishInventoryUseCase } from '../application/usecases/create-fish-inventory.usecase';
import { SaleFishInventoryUseCase } from '../application/usecases/sale-fish-inventory.usecase';
import { ListFishIventoriesUseCase } from '../application/usecases/list-fish-inventories.usecase';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'fishInventory', schema: FishInventorySchema },
      { name: 'user', schema: UserSchema },
      { name: 'land', schema: LandSchema },
      { name: 'fish', schema: FishSchema },
    ]),
    JwtAuthModule,
  ],
  controllers: [FishInventoryController],
  providers: [
    {
      provide: 'FishInventoryRepository',
      useClass: FishInventoryMongoRepository,
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
      provide: 'FishRepository',
      useClass: FishMongoRepository,
    },
    {
      provide: CreateFishInventoryUseCase.UseCase,
      useFactory: (
        fishInventoryRepository: FishInventoryRepository.Repository,
        userRepository: UserRepository.Repository,
        landRepository: LandRepository.Repository,
        fishRepository: FishRepository.Repository,
      ): CreateFishInventoryUseCase.UseCase => {
        return new CreateFishInventoryUseCase.UseCase(
          fishInventoryRepository,
          userRepository,
          landRepository,
          fishRepository,
        );
      },
      inject: ['FishInventoryRepository', 'UserRepository', 'LandRepository', 'FishRepository'],
    },
    {
      provide: SaleFishInventoryUseCase.UseCase,
      useFactory: (
        fishInventoryRepository: FishInventoryRepository.Repository,
        userRepository: UserRepository.Repository,
        landRepository: LandRepository.Repository,
      ): SaleFishInventoryUseCase.UseCase => {
        return new SaleFishInventoryUseCase.UseCase(
          fishInventoryRepository,
          userRepository,
          landRepository,
        );
      },
      inject: ['FishInventoryRepository', 'UserRepository', 'LandRepository'],
    },
    {
      provide: ListFishIventoriesUseCase.UseCase,
      useFactory: (
        fishInventoryRepository: FishInventoryRepository.Repository,
      ): ListFishIventoriesUseCase.UseCase => {
        return new ListFishIventoriesUseCase.UseCase(fishInventoryRepository);
      },
      inject: ['FishInventoryRepository'],
    },
  ],
})
export class FishInventoryModule {}
