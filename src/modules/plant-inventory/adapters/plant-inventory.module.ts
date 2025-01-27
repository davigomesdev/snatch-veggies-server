import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { JwtAuthModule } from '@infrastructure/jwt-auth/jwt-auth.module';

import { PlantInventoryController } from './plant-inventory.controller';

import { PlantInventorySchema } from '../infrastructure/mongo/plant-inventory-mongo.schema';
import { PlantInventoryRepository } from '../domain/plant-inventory.repository';
import { PlantInventoryMongoRepository } from '../infrastructure/mongo/plant-inventory-mongo.repository';

import { UserSchema } from '@modules/user/infrastructure/mongo/user-mongo.schema';
import { UserRepository } from '@modules/user/domain/user.repository';
import { UserMongoRepository } from '@modules/user/infrastructure/mongo/user-mongo.repository';

import { LandSchema } from '@modules/land/infrastructure/mongo/land-mongo.schema';
import { LandRepository } from '@modules/land/domain/land.repository';
import { LandMongoRepository } from '@modules/land/infrastructure/mongo/land-mongo.repository';

import { PlantSchema } from '@modules/plant/infrastructure/mongo/plant-mongo.schema';
import { PlantRepository } from '@modules/plant/domain/plant.repository';
import { PlantMongoRepository } from '@modules/plant/infrastructure/mongo/plant-mongo.repository';

import { SalePlantInventoryUseCase } from '../application/usecases/sale-plant-inventory.usecase';
import { CreatePlantInventoryUseCase } from '../application/usecases/create-plant-inventory.usecase';
import { FindPlantIventoryUseCase } from '../application/usecases/find-plant-inventory.usecase';
import { ListPlantIventoriesUseCase } from '../application/usecases/list-plant-inventories.usecase';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'plantInventory', schema: PlantInventorySchema },
      { name: 'user', schema: UserSchema },
      { name: 'land', schema: LandSchema },
      { name: 'plant', schema: PlantSchema },
    ]),
    JwtAuthModule,
  ],
  controllers: [PlantInventoryController],
  providers: [
    {
      provide: 'PlantInventoryRepository',
      useClass: PlantInventoryMongoRepository,
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
      provide: 'PlantRepository',
      useClass: PlantMongoRepository,
    },
    {
      provide: CreatePlantInventoryUseCase.UseCase,
      useFactory: (
        plantInventoryRepository: PlantInventoryRepository.Repository,
        userRepository: UserRepository.Repository,
        landRepository: LandRepository.Repository,
        plantRepository: PlantRepository.Repository,
      ): CreatePlantInventoryUseCase.UseCase => {
        return new CreatePlantInventoryUseCase.UseCase(
          plantInventoryRepository,
          userRepository,
          landRepository,
          plantRepository,
        );
      },
      inject: ['PlantInventoryRepository', 'UserRepository', 'LandRepository', 'PlantRepository'],
    },
    {
      provide: SalePlantInventoryUseCase.UseCase,
      useFactory: (
        plantInventoryRepository: PlantInventoryRepository.Repository,
        userRepository: UserRepository.Repository,
        landRepository: LandRepository.Repository,
      ): SalePlantInventoryUseCase.UseCase => {
        return new SalePlantInventoryUseCase.UseCase(
          plantInventoryRepository,
          userRepository,
          landRepository,
        );
      },
      inject: ['PlantInventoryRepository', 'UserRepository', 'LandRepository'],
    },
    {
      provide: ListPlantIventoriesUseCase.UseCase,
      useFactory: (
        plantInventoryRepository: PlantInventoryRepository.Repository,
      ): ListPlantIventoriesUseCase.UseCase => {
        return new ListPlantIventoriesUseCase.UseCase(plantInventoryRepository);
      },
      inject: ['PlantInventoryRepository'],
    },
    {
      provide: FindPlantIventoryUseCase.UseCase,
      useFactory: (
        plantInventoryRepository: PlantInventoryRepository.Repository,
      ): FindPlantIventoryUseCase.UseCase => {
        return new FindPlantIventoryUseCase.UseCase(plantInventoryRepository);
      },
      inject: ['PlantInventoryRepository'],
    },
  ],
})
export class PlantInventoryModule {}
