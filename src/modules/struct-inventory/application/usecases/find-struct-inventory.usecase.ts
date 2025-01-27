import { IUseCase } from '@application/usecases/use-case.interface';

import { StructInventoryRepository } from '@modules/struct-inventory/domain/struct-inventory.repository';
import {
  StructInventoryOutput,
  StructInventoryOutputMapper,
} from '../output/struct-inventory.output';

export namespace FindStructIventoryUseCase {
  export type Input = {
    userId: string;
    landId: string;
    structId: string;
    struct?: boolean;
    isVisible?: boolean;
  };

  export type Output = StructInventoryOutput;

  export class UseCase implements IUseCase<Input, Output> {
    public constructor(
      private readonly structInventoryRepository: StructInventoryRepository.Repository,
    ) {}

    public async execute(input: Input): Promise<Output> {
      const structIventory = await this.structInventoryRepository.find(input);
      return StructInventoryOutputMapper.toOutput(structIventory);
    }
  }
}
