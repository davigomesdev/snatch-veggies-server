import { IUseCase } from '@application/usecases/use-case.interface';

import { PlantRepository } from '@modules/plant/domain/plant.repository';
import { PlantOutput, PlantOutputMapper } from '../output/plant.output';

export namespace ListPlantsUseCase {
  export type Input = {
    isVisible?: boolean;
  };

  export type Output = PlantOutput[];

  export class UseCase implements IUseCase<Input, Output> {
    public constructor(private readonly plantRepository: PlantRepository.Repository) {}

    public async execute(input: Input): Promise<Output> {
      const plants = await this.plantRepository.findAll(input);
      return plants.map(PlantOutputMapper.toOutput);
    }
  }
}
