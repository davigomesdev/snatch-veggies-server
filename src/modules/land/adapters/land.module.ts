import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { EnvConfigModule } from '@infrastructure/env-config/env-config.module';
import { JwtAuthModule } from '@infrastructure/jwt-auth/jwt-auth.module';
import { EthersModule } from '@infrastructure/ethers/ethers.module';
import { JsonFileModule } from '@infrastructure/json-file/json-file.module';

import { JsonFileService } from '@infrastructure/json-file/json-file.service';
import { SnatchVeggiesLandService } from '@infrastructure/ethers/services/snatch-veggies-land.service';

import { LandController } from './land.controller';

import { LandSchema } from '../infrastructure/mongo/land-mongo.schema';
import { LandRepository } from '../domain/land.repository';
import { LandMongoRepository } from '../infrastructure/mongo/land-mongo.repository';

import { UserSchema } from '@modules/user/infrastructure/mongo/user-mongo.schema';
import { UserRepository } from '@modules/user/domain/user.repository';
import { UserMongoRepository } from '@modules/user/infrastructure/mongo/user-mongo.repository';

import { BlockSchema } from '@modules/block/infrastructure/mongo/block-mongo.schema';
import { BlockRepository } from '@modules/block/domain/block.repository';
import { BlockMongoRepository } from '@modules/block/infrastructure/mongo/block-mongo.repository';

import { BlockInventorySchema } from '@modules/block-inventory/infrastructure/mongo/block-inventory-mongo.schema';
import { BlockInventoryRepository } from '@modules/block-inventory/domain/block-inventory.repository';
import { BlockInventoryMongoRepository } from '@modules/block-inventory/infrastructure/mongo/block-inventory-mongo.repository';

import { StructSchema } from '@modules/struct/infrastructure/mongo/struct-mongo.schema';
import { StructRepository } from '@modules/struct/domain/struct.repository';
import { StructMongoRepository } from '@modules/struct/infrastructure/mongo/struct-mongo.repository';

import { StructInventorySchema } from '@modules/struct-inventory/infrastructure/mongo/struct-inventory-mongo.schema';
import { StructInventoryRepository } from '@modules/struct-inventory/domain/struct-inventory.repository';
import { StructInventoryMongoRepository } from '@modules/struct-inventory/infrastructure/mongo/struct-inventory-mongo.repository';

import { DecorationSchema } from '@modules/decoration/infrastructure/mongo/decoration-mongo.schema';
import { DecorationRepository } from '@modules/decoration/domain/decoration.repository';
import { DecorationMongoRepository } from '@modules/decoration/infrastructure/mongo/decoration-mongo.repository';

import { DecorationInventorySchema } from '@modules/decoration-inventory/infrastructure/mongo/decoration-inventory-mongo.schema';
import { DecorationInventoryRepository } from '@modules/decoration-inventory/domain/decoration-inventory.repository';
import { DecorationInventoryMongoRepository } from '@modules/decoration-inventory/infrastructure/mongo/decoration-inventory-mongo.repository';

import { PlantSchema } from '@modules/plant/infrastructure/mongo/plant-mongo.schema';
import { PlantRepository } from '@modules/plant/domain/plant.repository';
import { PlantMongoRepository } from '@modules/plant/infrastructure/mongo/plant-mongo.repository';

import { PlantInventorySchema } from '@modules/plant-inventory/infrastructure/mongo/plant-inventory-mongo.schema';
import { PlantInventoryRepository } from '@modules/plant-inventory/domain/plant-inventory.repository';
import { PlantInventoryMongoRepository } from '@modules/plant-inventory/infrastructure/mongo/plant-inventory-mongo.repository';

import { CreateLandUseCase } from '../application/usecases/create-land.usecase';
import { CreateBlockLandUseCase } from '../application/usecases/create-block-land.usecase';
import { CreateStructBlockLandUseCase } from '../application/usecases/create-struct-block-land.usecase';
import { CreateDecorationBlockLandUseCase } from '../application/usecases/create-decoration-block-land.usecase';
import { CreatePlantBlockLandUseCase } from '../application/usecases/create-plant-block-land.usecase';
import { HarvestPlantBlockLandUseCase } from '../application/usecases/harvest-plant-block-land.usecase';
import { TheftPlantBlockLandUseCase } from '../application/usecases/theft-plant-block-land.usecase';
import { MintStructBlockLandUseCase } from '../application/usecases/mint-struct-block-land.usecase';
import { FindLandUseCase } from '../application/usecases/find-land.usecase';
import { ListLandsUseCase } from '../application/usecases/list-lands.usecase';
import { DeleteStructBlockLandUseCase } from '../application/usecases/delete-struct-block-land.usecase';
import { DeleteDecorationBlockLandUseCase } from '../application/usecases/delete-decoration-block-land.usecase';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'land', schema: LandSchema },
      { name: 'user', schema: UserSchema },
      { name: 'block', schema: BlockSchema },
      { name: 'struct', schema: StructSchema },
      { name: 'decoration', schema: DecorationSchema },
      { name: 'plant', schema: PlantSchema },
      { name: 'blockInventory', schema: BlockInventorySchema },
      { name: 'structInventory', schema: StructInventorySchema },
      { name: 'decorationInventory', schema: DecorationInventorySchema },
      { name: 'plantInventory', schema: PlantInventorySchema },
    ]),
    EnvConfigModule,
    JwtAuthModule,
    EthersModule,
    JsonFileModule,
  ],
  controllers: [LandController],
  providers: [
    {
      provide: 'LandRepository',
      useClass: LandMongoRepository,
    },
    {
      provide: 'UserRepository',
      useClass: UserMongoRepository,
    },
    {
      provide: 'BlockRepository',
      useClass: BlockMongoRepository,
    },
    {
      provide: 'StructRepository',
      useClass: StructMongoRepository,
    },
    {
      provide: 'DecorationRepository',
      useClass: DecorationMongoRepository,
    },
    {
      provide: 'PlantRepository',
      useClass: PlantMongoRepository,
    },
    {
      provide: 'BlockInventoryRepository',
      useClass: BlockInventoryMongoRepository,
    },
    {
      provide: 'StructInventoryRepository',
      useClass: StructInventoryMongoRepository,
    },
    {
      provide: 'DecorationInventoryRepository',
      useClass: DecorationInventoryMongoRepository,
    },
    {
      provide: 'PlantInventoryRepository',
      useClass: PlantInventoryMongoRepository,
    },
    {
      provide: 'SnatchVeggiesLandService',
      useClass: SnatchVeggiesLandService,
    },
    {
      provide: 'JsonFileService',
      useClass: JsonFileService,
    },
    {
      provide: CreateLandUseCase.UseCase,
      useFactory: (
        landRepository: LandRepository.Repository,
        userRepository: UserRepository.Repository,
        blockRepository: BlockRepository.Repository,
        decorationRepository: DecorationRepository.Repository,
        blockInventoryRepository: BlockInventoryRepository.Repository,
        decorationInventoryRepository: DecorationInventoryRepository.Repository,
        plantRepository: PlantRepository.Repository,
        plantInventoryRepository: PlantInventoryRepository.Repository,
        snatchVeggiesLandService: SnatchVeggiesLandService,
        jsonFileService: JsonFileService,
      ): CreateLandUseCase.UseCase => {
        return new CreateLandUseCase.UseCase(
          landRepository,
          userRepository,
          blockRepository,
          decorationRepository,
          blockInventoryRepository,
          decorationInventoryRepository,
          plantRepository,
          plantInventoryRepository,
          snatchVeggiesLandService,
          jsonFileService,
        );
      },
      inject: [
        'LandRepository',
        'UserRepository',
        'BlockRepository',
        'DecorationRepository',
        'BlockInventoryRepository',
        'DecorationInventoryRepository',
        'PlantRepository',
        'PlantInventoryRepository',
        'SnatchVeggiesLandService',
        'JsonFileService',
      ],
    },
    {
      provide: CreateBlockLandUseCase.UseCase,
      useFactory: (
        landRepository: LandRepository.Repository,
        blockRepository: BlockRepository.Repository,
        blockInventoryRepository: BlockInventoryRepository.Repository,
        jsonFileService: JsonFileService,
      ): CreateBlockLandUseCase.UseCase => {
        return new CreateBlockLandUseCase.UseCase(
          landRepository,
          blockRepository,
          blockInventoryRepository,
          jsonFileService,
        );
      },
      inject: ['LandRepository', 'BlockRepository', 'BlockInventoryRepository', 'JsonFileService'],
    },
    {
      provide: CreateStructBlockLandUseCase.UseCase,
      useFactory: (
        landRepository: LandRepository.Repository,
        blockRepository: BlockRepository.Repository,
        structRepository: StructRepository.Repository,
        structInventoryRepository: StructInventoryRepository.Repository,
        jsonFileService: JsonFileService,
      ): CreateStructBlockLandUseCase.UseCase => {
        return new CreateStructBlockLandUseCase.UseCase(
          landRepository,
          blockRepository,
          structRepository,
          structInventoryRepository,
          jsonFileService,
        );
      },
      inject: [
        'LandRepository',
        'BlockRepository',
        'StructRepository',
        'StructInventoryRepository',
        'JsonFileService',
      ],
    },
    {
      provide: CreateDecorationBlockLandUseCase.UseCase,
      useFactory: (
        landRepository: LandRepository.Repository,
        blockRepository: BlockRepository.Repository,
        decorationRepository: DecorationRepository.Repository,
        decorationInventoryRepository: DecorationInventoryRepository.Repository,
        jsonFileService: JsonFileService,
      ): CreateDecorationBlockLandUseCase.UseCase => {
        return new CreateDecorationBlockLandUseCase.UseCase(
          landRepository,
          blockRepository,
          decorationRepository,
          decorationInventoryRepository,
          jsonFileService,
        );
      },
      inject: [
        'LandRepository',
        'BlockRepository',
        'DecorationRepository',
        'DecorationInventoryRepository',
        'JsonFileService',
      ],
    },
    {
      provide: CreatePlantBlockLandUseCase.UseCase,
      useFactory: (
        landRepository: LandRepository.Repository,
        blockRepository: BlockRepository.Repository,
        plantRepository: PlantRepository.Repository,
        plantInventoryRepository: PlantInventoryRepository.Repository,
        jsonFileService: JsonFileService,
      ): CreatePlantBlockLandUseCase.UseCase => {
        return new CreatePlantBlockLandUseCase.UseCase(
          landRepository,
          blockRepository,
          plantRepository,
          plantInventoryRepository,
          jsonFileService,
        );
      },
      inject: [
        'LandRepository',
        'BlockRepository',
        'PlantRepository',
        'PlantInventoryRepository',
        'JsonFileService',
      ],
    },
    {
      provide: HarvestPlantBlockLandUseCase.UseCase,
      useFactory: (
        landRepository: LandRepository.Repository,
        plantRepository: PlantRepository.Repository,
        plantInventoryRepository: PlantInventoryRepository.Repository,
        jsonFileService: JsonFileService,
      ): HarvestPlantBlockLandUseCase.UseCase => {
        return new HarvestPlantBlockLandUseCase.UseCase(
          landRepository,
          plantRepository,
          plantInventoryRepository,
          jsonFileService,
        );
      },
      inject: ['LandRepository', 'PlantRepository', 'PlantInventoryRepository', 'JsonFileService'],
    },
    {
      provide: TheftPlantBlockLandUseCase.UseCase,
      useFactory: (
        landRepository: LandRepository.Repository,
        plantRepository: PlantRepository.Repository,
        plantInventoryRepository: PlantInventoryRepository.Repository,
        jsonFileService: JsonFileService,
      ): TheftPlantBlockLandUseCase.UseCase => {
        return new TheftPlantBlockLandUseCase.UseCase(
          landRepository,
          plantRepository,
          plantInventoryRepository,
          jsonFileService,
        );
      },
      inject: ['LandRepository', 'PlantRepository', 'PlantInventoryRepository', 'JsonFileService'],
    },
    {
      provide: MintStructBlockLandUseCase.UseCase,
      useFactory: (
        landRepository: LandRepository.Repository,
        blockRepository: BlockRepository.Repository,
        structRepository: StructRepository.Repository,
        structInventoryRepository: StructInventoryRepository.Repository,
        jsonFileService: JsonFileService,
      ): MintStructBlockLandUseCase.UseCase => {
        return new MintStructBlockLandUseCase.UseCase(
          landRepository,
          blockRepository,
          structRepository,
          structInventoryRepository,
          jsonFileService,
        );
      },
      inject: [
        'LandRepository',
        'BlockRepository',
        'StructRepository',
        'StructInventoryRepository',
        'JsonFileService',
      ],
    },
    {
      provide: FindLandUseCase.UseCase,
      useFactory: (landRepository: LandRepository.Repository): FindLandUseCase.UseCase => {
        return new FindLandUseCase.UseCase(landRepository);
      },
      inject: ['LandRepository'],
    },
    {
      provide: ListLandsUseCase.UseCase,
      useFactory: (landRepository: LandRepository.Repository): ListLandsUseCase.UseCase => {
        return new ListLandsUseCase.UseCase(landRepository);
      },
      inject: ['LandRepository'],
    },
    {
      provide: DeleteStructBlockLandUseCase.UseCase,
      useFactory: (
        landRepository: LandRepository.Repository,
        structRepository: StructRepository.Repository,
        structInventoryRepository: StructInventoryRepository.Repository,
        jsonFileService: JsonFileService,
      ): DeleteStructBlockLandUseCase.UseCase => {
        return new DeleteStructBlockLandUseCase.UseCase(
          landRepository,
          structRepository,
          structInventoryRepository,
          jsonFileService,
        );
      },
      inject: [
        'LandRepository',
        'StructRepository',
        'StructInventoryRepository',
        'JsonFileService',
      ],
    },
    {
      provide: DeleteDecorationBlockLandUseCase.UseCase,
      useFactory: (
        landRepository: LandRepository.Repository,
        decorationRepository: DecorationRepository.Repository,
        decorationInventoryRepository: DecorationInventoryRepository.Repository,
        jsonFileService: JsonFileService,
      ): DeleteDecorationBlockLandUseCase.UseCase => {
        return new DeleteDecorationBlockLandUseCase.UseCase(
          landRepository,
          decorationRepository,
          decorationInventoryRepository,
          jsonFileService,
        );
      },
      inject: [
        'LandRepository',
        'DecorationRepository',
        'DecorationInventoryRepository',
        'JsonFileService',
      ],
    },
  ],
  exports: [
    CreateBlockLandUseCase.UseCase,
    CreateStructBlockLandUseCase.UseCase,
    CreateDecorationBlockLandUseCase.UseCase,
    CreatePlantBlockLandUseCase.UseCase,
    HarvestPlantBlockLandUseCase.UseCase,
    TheftPlantBlockLandUseCase.UseCase,
    MintStructBlockLandUseCase.UseCase,
    DeleteStructBlockLandUseCase.UseCase,
    DeleteDecorationBlockLandUseCase.UseCase,
  ],
})
export class LandModule {}
