import { IUseCase } from '@application/usecases/use-case.interface';

import { StructRepository } from '@modules/struct/domain/struct.repository';
import { StructOutput, StructOutputMapper } from '../output/struct.output';

export namespace FindStructUseCase {
  export type Input = {
    id: string;
    isVisible?: boolean;
  };

  export type Output = StructOutput;

  export class UseCase implements IUseCase<Input, Output> {
    public constructor(private readonly structRepository: StructRepository.Repository) {}

    public async execute(input: Input): Promise<Output> {
      const struct = await this.structRepository.find(input);
      return StructOutputMapper.toOutput(struct);
    }
  }
}
