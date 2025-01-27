import { File } from '@nest-lab/fastify-multer';

import { BadRequestError } from '@domain/errors/bad-request-error';

import { UploadService } from '@infrastructure/upload/upload.service';

import { IUseCase } from '@application/usecases/use-case.interface';

import { DecorationRepository } from '@modules/decoration/domain/decoration.repository';
import { DecorationOutput, DecorationOutputMapper } from '../output/decoration.output';

export namespace UpdateDecorationImageUseCase {
  export type Input = {
    id: string;
    image: File;
  };

  export type Output = DecorationOutput;

  export class UseCase implements IUseCase<Input, Output> {
    public constructor(
      private readonly decorationRepository: DecorationRepository.Repository,
      private readonly uploadService: UploadService,
    ) {}

    public async execute(input: Input): Promise<Output> {
      const { id, image } = input;

      if (!image) {
        throw new BadRequestError('Add an image to the decoration.');
      }

      const entity = await this.decorationRepository.find({ id });

      await this.uploadService.removeFile(entity.image, 'decoration');
      const imagePath = await this.uploadService.saveFile(image, 'decoration');

      entity.updateImage(imagePath);
      const decoration = await this.decorationRepository.update(entity);

      return DecorationOutputMapper.toOutput(decoration);
    }
  }
}
