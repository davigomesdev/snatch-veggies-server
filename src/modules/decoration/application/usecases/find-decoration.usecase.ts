import { IUseCase } from '@application/usecases/use-case.interface';

import { DecorationRepository } from '@modules/decoration/domain/decoration.repository';
import { DecorationOutput, DecorationOutputMapper } from '../output/decoration.output';

export namespace FindDecorationUseCase {
  export type Input = {
    id: string;
    isVisible?: boolean;
  };

  export type Output = DecorationOutput;

  export class UseCase implements IUseCase<Input, Output> {
    public constructor(private readonly decorationRepository: DecorationRepository.Repository) {}

    public async execute(input: Input): Promise<Output> {
      const decoration = await this.decorationRepository.find(input);
      return DecorationOutputMapper.toOutput(decoration);
    }
  }
}
