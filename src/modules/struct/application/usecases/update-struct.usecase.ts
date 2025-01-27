import { TVector2 } from '@core/types/vector2.type';

import { IUseCase } from '@application/usecases/use-case.interface';

import { StructRepository } from '@modules/struct/domain/struct.repository';
import { StructOutput, StructOutputMapper } from '../output/struct.output';

export namespace UpdateStructUseCase {
  export type Input = {
    id: string;
    index: number;
    name: string;
    itemName: string;
    price?: number;
    profit?: number;
    limit?: number;
    exp?: number;
    duration: number;
    size?: TVector2;
    isVisible: boolean;
  };

  export type Output = StructOutput;

  export class UseCase implements IUseCase<Input, Output> {
    public constructor(private readonly structRepository: StructRepository.Repository) {}

    public async execute(input: Input): Promise<Output> {
      const { id, index } = input;

      const entity = await this.structRepository.find({ id });

      if (entity.index !== index) {
        await this.structRepository.indexExists(input.index);
      }

      entity.update(input);
      const struct = await this.structRepository.update(entity);

      return StructOutputMapper.toOutput(struct);
    }
  }
}
