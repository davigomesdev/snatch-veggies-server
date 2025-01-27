import { IUseCase } from '@application/usecases/use-case.interface';

import { FishRepository } from '@modules/fish/domain/fish.repository';
import { FishOutput, FishOutputMapper } from '../output/fish.output';

export namespace UpdateFishUseCase {
  export type Input = {
    id: string;
    name: string;
    price: number;
    rarity: number;
  };

  export type Output = FishOutput;

  export class UseCase implements IUseCase<Input, Output> {
    public constructor(private readonly fishRepository: FishRepository.Repository) {}

    public async execute(input: Input): Promise<Output> {
      const entity = await this.fishRepository.find({ id: input.id });

      entity.update(input);
      const fish = await this.fishRepository.update(entity);

      return FishOutputMapper.toOutput(fish);
    }
  }
}
