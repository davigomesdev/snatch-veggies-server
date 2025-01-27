import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { JwtAuthModule } from '@infrastructure/jwt-auth/jwt-auth.module';

import { JwtAuthService } from '@infrastructure/jwt-auth/jwt-auth.service';

import { AuthController } from './auth.controller';

import { UserSchema } from '@modules/user/infrastructure/mongo/user-mongo.schema';
import { UserRepository } from '@modules/user/domain/user.repository';
import { UserMongoRepository } from '@modules/user/infrastructure/mongo/user-mongo.repository';

import { SignInUseCase } from '../application/usecases/signin.usecase';
import { RequestNonceUseCase } from '../application/usecases/request-nonce.usecase';
import { RefreshTokensUseCase } from '../application/usecases/refresh-tokens.usecase';

@Module({
  imports: [JwtAuthModule, MongooseModule.forFeature([{ name: 'user', schema: UserSchema }])],
  controllers: [AuthController],
  providers: [
    {
      provide: 'UserRepository',
      useClass: UserMongoRepository,
    },
    {
      provide: SignInUseCase.UseCase,
      useFactory: (
        userRepository: UserRepository.Repository,
        jwtAuthService: JwtAuthService,
      ): SignInUseCase.UseCase => {
        return new SignInUseCase.UseCase(userRepository, jwtAuthService);
      },
      inject: ['UserRepository', JwtAuthService],
    },
    {
      provide: RequestNonceUseCase.UseCase,
      useFactory: (userRepository: UserRepository.Repository): RequestNonceUseCase.UseCase => {
        return new RequestNonceUseCase.UseCase(userRepository);
      },
      inject: ['UserRepository'],
    },
    {
      provide: RefreshTokensUseCase.UseCase,
      useFactory: (
        userRepository: UserRepository.Repository,
        jwtAuthService: JwtAuthService,
      ): RefreshTokensUseCase.UseCase => {
        return new RefreshTokensUseCase.UseCase(userRepository, jwtAuthService);
      },
      inject: ['UserRepository', JwtAuthService],
    },
  ],
})
export class AuthModule {}
