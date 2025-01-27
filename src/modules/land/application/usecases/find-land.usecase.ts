import { IUseCase } from '@application/usecases/use-case.interface';

import { LandRepository } from '@modules/land/domain/land.repository';
import { LandOutput, LandOutputMapper } from '../output/land.output';

export namespace FindLandUseCase {
  export type Input = {
    id?: string;
    userId?: string;
    tokenId?: number;
  };

  export type Output = LandOutput;

  export class UseCase implements IUseCase<Input, Output> {
    public constructor(private readonly landRepository: LandRepository.Repository) {}

    public async execute(input: Input): Promise<Output> {
      const land = await this.landRepository.find(input);
      return LandOutputMapper.toOutput(land);
    }
  }
}
