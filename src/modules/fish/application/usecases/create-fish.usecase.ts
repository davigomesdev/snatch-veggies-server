import { File } from '@nest-lab/fastify-multer';

import { BadRequestError } from '@domain/errors/bad-request-error';

import { UploadService } from '@infrastructure/upload/upload.service';

import { IUseCase } from '@application/usecases/use-case.interface';

import { FishEntity } from '@modules/fish/domain/fish.entity';
import { FishRepository } from '@modules/fish/domain/fish.repository';
import { FishOutput, FishOutputMapper } from '../output/fish.output';

export namespace CreateFishUseCase {
  export type Input = {
    name: string;
    price: number;
    rarity: number;
    image: File;
  };

  export type Output = FishOutput;

  export class UseCase implements IUseCase<Input, Output> {
    public constructor(
      private readonly fishRepository: FishRepository.Repository,
      private readonly uploadService: UploadService,
    ) {}

    public async execute(input: Input): Promise<Output> {
      const { image, ...rest } = input;

      if (!image) {
        throw new BadRequestError('Add an image to the fish.');
      }

      const imagePath = await this.uploadService.saveFile(image, 'fish');

      const entity = new FishEntity({
        ...rest,
        image: imagePath,
      });
      const fish = await this.fishRepository.create(entity);

      return FishOutputMapper.toOutput(fish);
    }
  }
}
