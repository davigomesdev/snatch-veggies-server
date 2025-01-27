import { IUseCase } from '@application/usecases/use-case.interface';

import { DecorationInventoryRepository } from '@modules/decoration-inventory/domain/decoration-inventory.repository';
import {
  DecorationInventoryOutput,
  DecorationInventoryOutputMapper,
} from '../output/decoration-inventory.output';

export namespace ListDecorationIventoriesUseCase {
  export type Input = {
    userId?: string;
    landId?: string;
    decoration?: boolean;
    isVisible?: boolean;
  };

  export type Output = DecorationInventoryOutput[];

  export class UseCase implements IUseCase<Input, Output> {
    public constructor(
      private readonly decorationInventoryRepository: DecorationInventoryRepository.Repository,
    ) {}

    public async execute(input: Input): Promise<Output> {
      const decorationIventories = await this.decorationInventoryRepository.findAll(input);
      return decorationIventories.map(DecorationInventoryOutputMapper.toOutput);
    }
  }
}
