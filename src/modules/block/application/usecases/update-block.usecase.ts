import { BlockTypeEnum } from '@core/enums/block-type.enum';

import { IUseCase } from '@application/usecases/use-case.interface';

import { BlockRepository } from '@modules/block/domain/block.repository';
import { BlockOutput, BlockOutputMapper } from '../output/block.output';

export namespace UpdateBlockUseCase {
  export type Input = {
    id: string;
    index: number;
    name: string;
    price: number;
    limit: number;
    type: BlockTypeEnum;
    isVisible: boolean;
  };

  export type Output = BlockOutput;

  export class UseCase implements IUseCase<Input, Output> {
    public constructor(private readonly blockRepository: BlockRepository.Repository) {}

    public async execute(input: Input): Promise<Output> {
      const { id, index } = input;

      const entity = await this.blockRepository.find({ id });

      if (entity.index !== index) {
        await this.blockRepository.indexExists(input.index);
      }

      entity.update(input);
      const block = await this.blockRepository.update(entity);

      return BlockOutputMapper.toOutput(block);
    }
  }
}
