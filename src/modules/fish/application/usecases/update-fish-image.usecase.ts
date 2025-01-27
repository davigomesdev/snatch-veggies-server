import { File } from '@nest-lab/fastify-multer';

import { BadRequestError } from '@domain/errors/bad-request-error';

import { UploadService } from '@infrastructure/upload/upload.service';

import { IUseCase } from '@application/usecases/use-case.interface';

import { FishRepository } from '@modules/fish/domain/fish.repository';
import { FishOutput, FishOutputMapper } from '../output/fish.output';

export namespace UpdateFishImageUseCase {
  export type Input = {
    id: string;
    image: File;
  };

  export type Output = FishOutput;

  export class UseCase implements IUseCase<Input, Output> {
    public constructor(
      private readonly fishRepository: FishRepository.Repository,
      private readonly uploadService: UploadService,
    ) {}

    public async execute(input: Input): Promise<Output> {
      const { id, image } = input;

      if (!image) {
        throw new BadRequestError('Add an image to the fish.');
      }

      const entity = await this.fishRepository.find({ id });

      await this.uploadService.removeFile(entity.image, 'fish');
      const imagePath = await this.uploadService.saveFile(image, 'fish');

      entity.updateImage(imagePath);
      const fish = await this.fishRepository.update(entity);

      return FishOutputMapper.toOutput(fish);
    }
  }
}
