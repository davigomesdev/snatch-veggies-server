import { File } from '@nest-lab/fastify-multer';

import { BadRequestError } from '@domain/errors/bad-request-error';

import { UploadService } from '@infrastructure/upload/upload.service';

import { IUseCase } from '@application/usecases/use-case.interface';

import { StructRepository } from '@modules/struct/domain/struct.repository';
import { StructOutput, StructOutputMapper } from '../output/struct.output';

export namespace UpdateStructItemImageUseCase {
  export type Input = {
    id: string;
    image: File;
  };

  export type Output = StructOutput;

  export class UseCase implements IUseCase<Input, Output> {
    public constructor(
      private readonly structRepository: StructRepository.Repository,
      private readonly uploadService: UploadService,
    ) {}

    public async execute(input: Input): Promise<Output> {
      const { id, image } = input;

      if (!image) {
        throw new BadRequestError('Add an image to the struct.');
      }

      const entity = await this.structRepository.find({ id });

      if (entity.itemImage) {
        await this.uploadService.removeFile(entity.itemImage, 'struct-item');
      }

      const imagePath = await this.uploadService.saveFile(image, 'struct-item');

      entity.updateItemImage(imagePath);
      const struct = await this.structRepository.update(entity);

      return StructOutputMapper.toOutput(struct);
    }
  }
}
