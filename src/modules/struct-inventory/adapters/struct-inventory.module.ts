import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { JwtAuthModule } from '@infrastructure/jwt-auth/jwt-auth.module';

import { StructInventoryController } from './struct-inventory.controller';

import { StructInventorySchema } from '../infrastructure/mongo/struct-inventory-mongo.schema';
import { StructInventoryRepository } from '../domain/struct-inventory.repository';
import { StructInventoryMongoRepository } from '../infrastructure/mongo/struct-inventory-mongo.repository';

import { UserSchema } from '@modules/user/infrastructure/mongo/user-mongo.schema';
import { UserRepository } from '@modules/user/domain/user.repository';
import { UserMongoRepository } from '@modules/user/infrastructure/mongo/user-mongo.repository';

import { LandSchema } from '@modules/land/infrastructure/mongo/land-mongo.schema';
import { LandRepository } from '@modules/land/domain/land.repository';
import { LandMongoRepository } from '@modules/land/infrastructure/mongo/land-mongo.repository';

import { StructSchema } from '@modules/struct/infrastructure/mongo/struct-mongo.schema';
import { StructRepository } from '@modules/struct/domain/struct.repository';
import { StructMongoRepository } from '@modules/struct/infrastructure/mongo/struct-mongo.repository';

import { CreateStructInventoryUseCase } from '../application/usecases/create-struct-inventory.usecase';
import { SaleStructInventoryUseCase } from '../application/usecases/sale-struct-inventory.usecase';
import { FindStructIventoryUseCase } from '../application/usecases/find-struct-inventory.usecase';
import { ListStructIventoriesUseCase } from '../application/usecases/list-struct-inventories.usecase';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'structInventory', schema: StructInventorySchema },
      { name: 'user', schema: UserSchema },
      { name: 'land', schema: LandSchema },
      { name: 'struct', schema: StructSchema },
    ]),
    JwtAuthModule,
  ],
  controllers: [StructInventoryController],
  providers: [
    {
      provide: 'StructInventoryRepository',
      useClass: StructInventoryMongoRepository,
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
      provide: 'StructRepository',
      useClass: StructMongoRepository,
    },
    {
      provide: CreateStructInventoryUseCase.UseCase,
      useFactory: (
        structInventoryRepository: StructInventoryRepository.Repository,
        userRepository: UserRepository.Repository,
        landRepository: LandRepository.Repository,
        structRepository: StructRepository.Repository,
      ): CreateStructInventoryUseCase.UseCase => {
        return new CreateStructInventoryUseCase.UseCase(
          structInventoryRepository,
          userRepository,
          landRepository,
          structRepository,
        );
      },
      inject: ['StructInventoryRepository', 'UserRepository', 'LandRepository', 'StructRepository'],
    },
    {
      provide: SaleStructInventoryUseCase.UseCase,
      useFactory: (
        structInventoryRepository: StructInventoryRepository.Repository,
        userRepository: UserRepository.Repository,
        landRepository: LandRepository.Repository,
      ): SaleStructInventoryUseCase.UseCase => {
        return new SaleStructInventoryUseCase.UseCase(
          structInventoryRepository,
          userRepository,
          landRepository,
        );
      },
      inject: ['StructInventoryRepository', 'UserRepository', 'LandRepository'],
    },
    {
      provide: FindStructIventoryUseCase.UseCase,
      useFactory: (
        structInventoryRepository: StructInventoryRepository.Repository,
      ): FindStructIventoryUseCase.UseCase => {
        return new FindStructIventoryUseCase.UseCase(structInventoryRepository);
      },
      inject: ['StructInventoryRepository'],
    },
    {
      provide: ListStructIventoriesUseCase.UseCase,
      useFactory: (
        structInventoryRepository: StructInventoryRepository.Repository,
      ): ListStructIventoriesUseCase.UseCase => {
        return new ListStructIventoriesUseCase.UseCase(structInventoryRepository);
      },
      inject: ['StructInventoryRepository'],
    },
  ],
})
export class StructInventoryModule {}
