import { IUseCase } from '@application/usecases/use-case.interface';

import { PlantInventoryRepository } from '@modules/plant-inventory/domain/plant-inventory.repository';
import { PlantInventoryOutput, PlantInventoryOutputMapper } from '../output/plant-inventory.output';

export namespace ListPlantIventoriesUseCase {
  export type Input = {
    userId?: string;
    landId?: string;
    plant?: boolean;
    isVisible?: boolean;
  };

  export type Output = PlantInventoryOutput[];

  export class UseCase implements IUseCase<Input, Output> {
    public constructor(
      private readonly plantInventoryRepository: PlantInventoryRepository.Repository,
    ) {}

    public async execute(input: Input): Promise<Output> {
      const plantIventories = await this.plantInventoryRepository.findAll(input);
      return plantIventories.map(PlantInventoryOutputMapper.toOutput);
    }
  }
}
