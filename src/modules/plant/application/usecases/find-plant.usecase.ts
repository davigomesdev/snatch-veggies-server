import { IUseCase } from '@application/usecases/use-case.interface';

import { PlantRepository } from '@modules/plant/domain/plant.repository';
import { PlantOutput, PlantOutputMapper } from '../output/plant.output';

export namespace FindPlantUseCase {
  export type Input = {
    id: string;
    isVisible?: boolean;
  };

  export type Output = PlantOutput;

  export class UseCase implements IUseCase<Input, Output> {
    public constructor(private readonly plantRepository: PlantRepository.Repository) {}

    public async execute(input: Input): Promise<Output> {
      const plant = await this.plantRepository.find(input);
      return PlantOutputMapper.toOutput(plant);
    }
  }
}
