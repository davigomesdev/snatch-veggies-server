import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { JwtAuthModule } from '@infrastructure/jwt-auth/jwt-auth.module';

import { DecorationInventoryController } from './decoration-inventory.controller';

import { DecorationInventorySchema } from '../infrastructure/mongo/decoration-inventory-mongo.schema';
import { DecorationInventoryRepository } from '../domain/decoration-inventory.repository';
import { DecorationInventoryMongoRepository } from '../infrastructure/mongo/decoration-inventory-mongo.repository';

import { UserSchema } from '@modules/user/infrastructure/mongo/user-mongo.schema';
import { UserRepository } from '@modules/user/domain/user.repository';
import { UserMongoRepository } from '@modules/user/infrastructure/mongo/user-mongo.repository';

import { LandSchema } from '@modules/land/infrastructure/mongo/land-mongo.schema';
import { LandRepository } from '@modules/land/domain/land.repository';
import { LandMongoRepository } from '@modules/land/infrastructure/mongo/land-mongo.repository';

import { DecorationSchema } from '@modules/decoration/infrastructure/mongo/decoration-mongo.schema';
import { DecorationRepository } from '@modules/decoration/domain/decoration.repository';
import { DecorationMongoRepository } from '@modules/decoration/infrastructure/mongo/decoration-mongo.repository';

import { ListDecorationIventoriesUseCase } from '../application/usecases/list-decoration-inventories.usecase';
import { FindDecorationIventoryUseCase } from '../application/usecases/find-decoration-inventory.usecase';
import { CreateDecorationInventoryUseCase } from '../application/usecases/create-decoration-inventory.usecase';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'decorationInventory', schema: DecorationInventorySchema },
      { name: 'user', schema: UserSchema },
      { name: 'land', schema: LandSchema },
      { name: 'decoration', schema: DecorationSchema },
    ]),
    JwtAuthModule,
  ],
  controllers: [DecorationInventoryController],
  providers: [
    {
      provide: 'DecorationInventoryRepository',
      useClass: DecorationInventoryMongoRepository,
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
      provide: 'DecorationRepository',
      useClass: DecorationMongoRepository,
    },
    {
      provide: CreateDecorationInventoryUseCase.UseCase,
      useFactory: (
        decorationInventoryRepository: DecorationInventoryRepository.Repository,
        userRepository: UserRepository.Repository,
        landRepository: LandRepository.Repository,
        decorationRepository: DecorationRepository.Repository,
      ): CreateDecorationInventoryUseCase.UseCase => {
        return new CreateDecorationInventoryUseCase.UseCase(
          decorationInventoryRepository,
          userRepository,
          landRepository,
          decorationRepository,
        );
      },
      inject: [
        'DecorationInventoryRepository',
        'UserRepository',
        'LandRepository',
        'DecorationRepository',
      ],
    },
    {
      provide: FindDecorationIventoryUseCase.UseCase,
      useFactory: (
        decorationInventoryRepository: DecorationInventoryRepository.Repository,
      ): FindDecorationIventoryUseCase.UseCase => {
        return new FindDecorationIventoryUseCase.UseCase(decorationInventoryRepository);
      },
      inject: ['DecorationInventoryRepository'],
    },
    {
      provide: ListDecorationIventoriesUseCase.UseCase,
      useFactory: (
        decorationInventoryRepository: DecorationInventoryRepository.Repository,
      ): ListDecorationIventoriesUseCase.UseCase => {
        return new ListDecorationIventoriesUseCase.UseCase(decorationInventoryRepository);
      },
      inject: ['DecorationInventoryRepository'],
    },
  ],
})
export class DecorationInventoryModule {}
