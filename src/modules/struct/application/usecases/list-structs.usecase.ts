import { IUseCase } from '@application/usecases/use-case.interface';

import { StructRepository } from '@modules/struct/domain/struct.repository';
import { StructOutput, StructOutputMapper } from '../output/struct.output';

export namespace ListStructsUseCase {
  export type Input = {
    isVisible?: boolean;
  };

  export type Output = StructOutput[];

  export class UseCase implements IUseCase<Input, Output> {
    public constructor(private readonly structRepository: StructRepository.Repository) {}

    public async execute(input: Input): Promise<Output> {
      const structs = await this.structRepository.findAll(input);
      return structs.map(StructOutputMapper.toOutput);
    }
  }
}
