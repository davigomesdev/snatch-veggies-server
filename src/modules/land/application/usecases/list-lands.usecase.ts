import { IUseCase } from '@application/usecases/use-case.interface';

import { LandRepository } from '@modules/land/domain/land.repository';
import { LandOutput, LandOutputMapper } from '../output/land.output';

export namespace ListLandsUseCase {
  export type Input = {
    userId?: string;
  };

  export type Output = LandOutput[];

  export class UseCase implements IUseCase<Input, Output> {
    public constructor(private readonly landRepository: LandRepository.Repository) {}

    public async execute(input?: Input): Promise<Output> {
      const entities = await this.landRepository.findAll(input);
      return entities.map(LandOutputMapper.toOutput);
    }
  }
}
