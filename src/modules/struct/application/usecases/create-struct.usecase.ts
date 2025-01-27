import { File } from '@nest-lab/fastify-multer';

import { TVector2 } from '@core/types/vector2.type';

import { BadRequestError } from '@domain/errors/bad-request-error';

import { UploadService } from '@infrastructure/upload/upload.service';

import { IUseCase } from '@application/usecases/use-case.interface';

import { StructEntity } from '@modules/struct/domain/struct.entity';
import { StructRepository } from '@modules/struct/domain/struct.repository';
import { StructOutput, StructOutputMapper } from '../output/struct.output';

export namespace CreateStructUseCase {
  export type Input = {
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
    image: File;
  };

  export type Output = StructOutput;

  export class UseCase implements IUseCase<Input, Output> {
    public constructor(
      private readonly structRepository: StructRepository.Repository,
      private readonly uploadService: UploadService,
    ) {}

    public async execute(input: Input): Promise<Output> {
      const { image, ...rest } = input;

      if (!image) {
        throw new BadRequestError('Add an image to the decoration.');
      }

      await this.structRepository.indexExists(input.index);
      const imagePath = await this.uploadService.saveFile(image, 'struct');

      const entity = new StructEntity({
        ...rest,
        image: imagePath,
      });
      const struct = await this.structRepository.create(entity);

      return StructOutputMapper.toOutput(struct);
    }
  }
}
