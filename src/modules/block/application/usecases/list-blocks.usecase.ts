import { IUseCase } from '@application/usecases/use-case.interface';

import { BlockRepository } from '@modules/block/domain/block.repository';
import { BlockOutput, BlockOutputMapper } from '../output/block.output';

export namespace ListBlocksUseCase {
  export type Input = {
    isVisible?: boolean;
  };

  export type Output = BlockOutput[];

  export class UseCase implements IUseCase<Input, Output> {
    public constructor(private readonly blockRepository: BlockRepository.Repository) {}

    public async execute(input: Input): Promise<Output> {
      const blocks = await this.blockRepository.findAll(input);
      return blocks.map(BlockOutputMapper.toOutput);
    }
  }
}
