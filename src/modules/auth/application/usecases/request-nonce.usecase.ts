import { v4 as uuidv4 } from 'uuid';

import { IUseCase } from '@application/usecases/use-case.interface';

import { UserEntity } from '@modules/user/domain/user.entity';
import { UserRepository } from '@modules/user/domain/user.repository';

export namespace RequestNonceUseCase {
  export type Input = {
    address: string;
  };

  export type Output = {
    nonce: string;
  };

  export class UseCase implements IUseCase<Input, Output> {
    public constructor(private readonly userRepository: UserRepository.Repository) {}

    public async execute(input: Input): Promise<Output> {
      const isExists = await this.userRepository.isExists(input.address);

      let entity: UserEntity;

      if (isExists) {
        entity = await this.userRepository.find(input);
      } else {
        const newEntity = new UserEntity({
          address: input.address,
          nonce: uuidv4(),
        });

        entity = await this.userRepository.create(newEntity);
      }

      const nonce = uuidv4();
      entity.updateNonce(nonce);

      await this.userRepository.update(entity);

      return { nonce };
    }
  }
}
