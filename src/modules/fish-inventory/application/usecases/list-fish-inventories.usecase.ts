import { IUseCase } from '@application/usecases/use-case.interface';

import { FishInventoryRepository } from '@modules/fish-inventory/domain/fish-inventory.repository';
import { FishInventoryOutput, FishInventoryOutputMapper } from '../output/fish-inventory.output';

export namespace ListFishIventoriesUseCase {
  export type Input = {
    userId?: string;
    landId?: string;
    fish?: boolean;
  };

  export type Output = FishInventoryOutput[];

  export class UseCase implements IUseCase<Input, Output> {
    public constructor(
      private readonly fishInventoryRepository: FishInventoryRepository.Repository,
    ) {}

    public async execute(input: Input): Promise<Output> {
      const fishIventories = await this.fishInventoryRepository.findAll(input);
      return fishIventories.map(FishInventoryOutputMapper.toOutput);
    }
  }
}
