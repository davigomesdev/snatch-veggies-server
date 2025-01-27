import { IUseCase } from '@application/usecases/use-case.interface';

import { StructInventoryRepository } from '@modules/struct-inventory/domain/struct-inventory.repository';
import {
  StructInventoryOutput,
  StructInventoryOutputMapper,
} from '../output/struct-inventory.output';

export namespace ListStructIventoriesUseCase {
  export type Input = {
    userId?: string;
    landId?: string;
    struct?: boolean;
    isVisible?: boolean;
  };

  export type Output = StructInventoryOutput[];

  export class UseCase implements IUseCase<Input, Output> {
    public constructor(
      private readonly structInventoryRepository: StructInventoryRepository.Repository,
    ) {}

    public async execute(input: Input): Promise<Output> {
      const structIventories = await this.structInventoryRepository.findAll(input);
      return structIventories.map(StructInventoryOutputMapper.toOutput);
    }
  }
}
