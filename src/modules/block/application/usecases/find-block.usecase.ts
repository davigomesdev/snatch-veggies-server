import { IUseCase } from '@application/usecases/use-case.interface';

import { BlockRepository } from '@modules/block/domain/block.repository';
import { BlockOutput, BlockOutputMapper } from '../output/block.output';

export namespace FindBlockUseCase {
  export type Input = {
    id: string;
    isVisible?: boolean;
  };

  export type Output = BlockOutput;

  export class UseCase implements IUseCase<Input, Output> {
    public constructor(private readonly blockRepository: BlockRepository.Repository) {}

    public async execute(input: Input): Promise<Output> {
      const block = await this.blockRepository.find(input);
      return BlockOutputMapper.toOutput(block);
    }
  }
}
