import { TVector2 } from '@core/types/vector2.type';

import { IUseCase } from '@application/usecases/use-case.interface';

import { DecorationRepository } from '@modules/decoration/domain/decoration.repository';
import { DecorationOutput, DecorationOutputMapper } from '../output/decoration.output';

export namespace UpdateDecorationUseCase {
  export type Input = {
    id: string;
    index: number;
    name: string;
    price?: number;
    limit?: number;
    size?: TVector2;
    isVisible: boolean;
  };

  export type Output = DecorationOutput;

  export class UseCase implements IUseCase<Input, Output> {
    public constructor(private readonly decorationRepository: DecorationRepository.Repository) {}

    public async execute(input: Input): Promise<Output> {
      const { id, index } = input;

      const entity = await this.decorationRepository.find({ id });

      if (entity.index !== index) {
        await this.decorationRepository.indexExists(input.index);
      }

      entity.update(input);
      const decoration = await this.decorationRepository.update(entity);

      return DecorationOutputMapper.toOutput(decoration);
    }
  }
}
