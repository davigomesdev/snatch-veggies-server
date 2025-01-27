import { verifyMessage } from 'ethers';

import { TAuth } from '@core/types/auth.type';

import { InvalidCredentialsError } from '@domain/errors/invalid-credentials-error';

import { JwtAuthService } from '@infrastructure/jwt-auth/jwt-auth.service';

import { IUseCase } from '@application/usecases/use-case.interface';

import { UserRepository } from '@modules/user/domain/user.repository';

export namespace SignInUseCase {
  export type Input = {
    address: string;
    signature: string;
  };

  export type Output = TAuth;

  export class UseCase implements IUseCase<Input, Output> {
    public constructor(
      private readonly userRepository: UserRepository.Repository,
      private readonly jwtAuthService: JwtAuthService,
    ) {}

    public async execute(input: Input): Promise<Output> {
      const { address, signature } = input;

      const entity = await this.userRepository.find({ address });

      const message = `Please sign this message to login: ${entity.nonce}`;
      const recoveredAddress = verifyMessage(message, signature);

      if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
        throw new InvalidCredentialsError('Invalid credentials.');
      }

      const tokens = await this.jwtAuthService.generateJwt({
        id: entity.id,
        address: entity.address,
      });

      await entity.updateRefreshToken(tokens.refreshToken);
      await this.userRepository.update(entity);

      return tokens;
    }
  }
}
