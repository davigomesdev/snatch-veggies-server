import { IUseCase } from '@application/usecases/use-case.interface';

import { FishRepository } from '@modules/fish/domain/fish.repository';
import { FishOutput, FishOutputMapper } from '../output/fish.output';

export namespace ListFishesUseCase {
  export type Input = void;

  export type Output = FishOutput[];

  export class UseCase implements IUseCase<Input, Output> {
    public constructor(private readonly fishRepository: FishRepository.Repository) {}

    public async execute(): Promise<Output> {
      const fishes = await this.fishRepository.findAll();
      return fishes.map(FishOutputMapper.toOutput);
    }
  }
}
