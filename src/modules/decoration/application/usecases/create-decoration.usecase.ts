import { File } from '@nest-lab/fastify-multer';

import { TVector2 } from '@core/types/vector2.type';

import { BadRequestError } from '@domain/errors/bad-request-error';

import { UploadService } from '@infrastructure/upload/upload.service';

import { IUseCase } from '@application/usecases/use-case.interface';

import { DecorationEntity } from '@modules/decoration/domain/decoration.entity';
import { DecorationRepository } from '@modules/decoration/domain/decoration.repository';
import { DecorationOutput, DecorationOutputMapper } from '../output/decoration.output';

export namespace CreateDecorationUseCase {
  export type Input = {
    index: number;
    name: string;
    price?: number;
    limit?: number;
    size?: TVector2;
    isVisible: boolean;
    image: File;
  };

  export type Output = DecorationOutput;

  export class UseCase implements IUseCase<Input, Output> {
    public constructor(
      private readonly decorationRepository: DecorationRepository.Repository,
      private readonly uploadService: UploadService,
    ) {}

    public async execute(input: Input): Promise<Output> {
      const { image, ...rest } = input;

      if (!image) {
        throw new BadRequestError('Add an image to the decoration.');
      }

      await this.decorationRepository.indexExists(input.index);
      const imagePath = await this.uploadService.saveFile(image, 'decoration');

      const entity = new DecorationEntity({
        ...rest,
        image: imagePath,
      });
      const decoration = await this.decorationRepository.create(entity);

      return DecorationOutputMapper.toOutput(decoration);
    }
  }
}
