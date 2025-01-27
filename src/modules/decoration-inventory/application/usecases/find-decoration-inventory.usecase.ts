import { IUseCase } from '@application/usecases/use-case.interface';

import { DecorationInventoryRepository } from '@modules/decoration-inventory/domain/decoration-inventory.repository';
import {
  DecorationInventoryOutput,
  DecorationInventoryOutputMapper,
} from '../output/decoration-inventory.output';

export namespace FindDecorationIventoryUseCase {
  export type Input = {
    userId: string;
    landId: string;
    decorationId: string;
    decoration?: boolean;
    isVisible?: boolean;
  };

  export type Output = DecorationInventoryOutput;

  export class UseCase implements IUseCase<Input, Output> {
    public constructor(
      private readonly decorationInventoryRepository: DecorationInventoryRepository.Repository,
    ) {}

    public async execute(input: Input): Promise<Output> {
      const decorationIventory = await this.decorationInventoryRepository.find(input);
      return DecorationInventoryOutputMapper.toOutput(decorationIventory);
    }
  }
}
