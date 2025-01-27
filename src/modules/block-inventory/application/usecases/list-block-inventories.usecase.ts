import { IUseCase } from '@application/usecases/use-case.interface';

import { BlockInventoryRepository } from '@modules/block-inventory/domain/block-inventory.repository';
import { BlockInventoryOutput, BlockInventoryOutputMapper } from '../output/block-inventory.output';

export namespace ListBlockIventoriesUseCase {
  export type Input = {
    userId?: string;
    landId?: string;
    block?: boolean;
    isVisible?: boolean;
  };

  export type Output = BlockInventoryOutput[];

  export class UseCase implements IUseCase<Input, Output> {
    public constructor(
      private readonly blockInventoryRepository: BlockInventoryRepository.Repository,
    ) {}

    public async execute(input: Input): Promise<Output> {
      const blockIventories = await this.blockInventoryRepository.findAll(input);
      return blockIventories.map(BlockInventoryOutputMapper.toOutput);
    }
  }
}
