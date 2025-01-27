import { IUseCase } from '@application/usecases/use-case.interface';

import { PlantRepository } from '@modules/plant/domain/plant.repository';
import { PlantOutput, PlantOutputMapper } from '../output/plant.output';

export namespace UpdatePlantUseCase {
  export type Input = {
    id: string;
    index: number;
    name: string;
    price?: number;
    profit?: number;
    duration: number;
    exp?: number;
    isVisible: boolean;
  };

  export type Output = PlantOutput;

  export class UseCase implements IUseCase<Input, Output> {
    public constructor(private readonly plantRepository: PlantRepository.Repository) {}

    public async execute(input: Input): Promise<Output> {
      const { id, index } = input;

      const entity = await this.plantRepository.find({ id });

      if (entity.index !== index) {
        await this.plantRepository.indexExists(input.index);
      }

      entity.update(input);
      const plant = await this.plantRepository.update(entity);

      return PlantOutputMapper.toOutput(plant);
    }
  }
}
