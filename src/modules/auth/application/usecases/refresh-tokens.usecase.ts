import { TAuth } from '@core/types/auth.type';
import { TCurrentUser } from '@core/types/current-user.type';

import { UnauthorizedException } from '@nestjs/common';

import { JwtAuthService } from '@infrastructure/jwt-auth/jwt-auth.service';

import { IUseCase } from '@application/usecases/use-case.interface';

import { UserRepository } from '@modules/user/domain/user.repository';

export namespace RefreshTokensUseCase {
  export type Input = {
    refreshToken: string;
  };

  export type Output = TAuth;

  export class UseCase implements IUseCase<Input, Output> {
    public constructor(
      private readonly userRepository: UserRepository.Repository,
      private readonly jwtAuthService: JwtAuthService,
    ) {}

    public async execute(input: Input): Promise<Output> {
      const { id } = await this.jwtAuthService.verifyJwt(input.refreshToken).catch(() => {
        throw new UnauthorizedException();
      });

      const entity = await this.userRepository.find({ id });

      const payload: TCurrentUser = {
        id: entity.id,
        address: entity.address,
      };

      const tokens = await this.jwtAuthService.generateJwt(payload);

      await entity.updateRefreshToken(tokens.refreshToken);
      await this.userRepository.update(entity);

      return tokens;
    }
  }
}
