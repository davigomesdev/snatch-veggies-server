import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { EnvConfigModule } from '@infrastructure/env-config/env-config.module';
import { JwtAuthModule } from '@infrastructure/jwt-auth/jwt-auth.module';
import { EthersModule } from '@infrastructure/ethers/ethers.module';
import { JsonFileModule } from '@infrastructure/json-file/json-file.module';

import { EnvConfigService } from '@infrastructure/env-config/env-config.service';
import { SnatchVeggiesService } from '@infrastructure/ethers/services/snatch-veggies.service';
import { SnatchVeggiesBankService } from '@infrastructure/ethers/services/snatch-veggies-bank.service';

import { UserController } from './user.controller';

import { UserSchema } from '@modules/user/infrastructure/mongo/user-mongo.schema';
import { UserRepository } from '@modules/user/domain/user.repository';
import { UserMongoRepository } from '@modules/user/infrastructure/mongo/user-mongo.repository';

import { FindUserUseCase } from '../application/usecases/find-user.usecase';
import { DepositCoinUserUseCase } from '../application/usecases/deposit-coin-user.usecase';
import { WithdrawCoinUserUseCase } from '../application/usecases/withdraw-coin-user.usecase';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'user', schema: UserSchema }]),
    EnvConfigModule,
    JwtAuthModule,
    EthersModule,
    JsonFileModule,
  ],
  controllers: [UserController],
  providers: [
    {
      provide: 'UserRepository',
      useClass: UserMongoRepository,
    },
    {
      provide: 'SnatchVeggiesService',
      useClass: SnatchVeggiesService,
    },
    {
      provide: 'SnatchVeggiesBankService',
      useClass: SnatchVeggiesBankService,
    },
    {
      provide: DepositCoinUserUseCase.UseCase,
      useFactory: (
        userRepository: UserRepository.Repository,
        snatchVeggiesService: SnatchVeggiesService,
        snatchVeggiesBankService: SnatchVeggiesBankService,
        envConfigService: EnvConfigService,
      ): DepositCoinUserUseCase.UseCase => {
        return new DepositCoinUserUseCase.UseCase(
          userRepository,
          snatchVeggiesService,
          snatchVeggiesBankService,
          envConfigService,
        );
      },
      inject: [
        'UserRepository',
        'SnatchVeggiesService',
        'SnatchVeggiesBankService',
        EnvConfigService,
      ],
    },
    {
      provide: WithdrawCoinUserUseCase.UseCase,
      useFactory: (
        userRepository: UserRepository.Repository,
        snatchVeggiesService: SnatchVeggiesService,
        snatchVeggiesBankService: SnatchVeggiesBankService,
      ): WithdrawCoinUserUseCase.UseCase => {
        return new WithdrawCoinUserUseCase.UseCase(
          userRepository,
          snatchVeggiesService,
          snatchVeggiesBankService,
        );
      },
      inject: ['UserRepository', 'SnatchVeggiesService', 'SnatchVeggiesBankService'],
    },
    {
      provide: FindUserUseCase.UseCase,
      useFactory: (userRepository: UserRepository.Repository): FindUserUseCase.UseCase => {
        return new FindUserUseCase.UseCase(userRepository);
      },
      inject: ['UserRepository'],
    },
  ],
})
export class UserModule {}
