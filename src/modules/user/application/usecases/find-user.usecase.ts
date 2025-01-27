import { IUseCase } from '@application/usecases/use-case.interface';

import { UserRepository } from '@modules/user/domain/user.repository';
import { UserOutput, UserOutputMapper } from '../output/user.output';

export namespace FindUserUseCase {
  export type Input = {
    id: string;
  };

  export type Output = UserOutput;

  export class UseCase implements IUseCase<Input, Output> {
    public constructor(private readonly userRepository: UserRepository.Repository) {}

    public async execute(input: Input): Promise<Output> {
      const user = await this.userRepository.find(input);
      return UserOutputMapper.toOutput(user);
    }
  }
}
