import { File } from '@nest-lab/fastify-multer';

import { BadRequestError } from '@domain/errors/bad-request-error';

import { UploadService } from '@infrastructure/upload/upload.service';

import { IUseCase } from '@application/usecases/use-case.interface';

import { PlantRepository } from '@modules/plant/domain/plant.repository';
import { PlantOutput, PlantOutputMapper } from '../output/plant.output';

export namespace UpdatePlantImageUseCase {
  export type Input = {
    id: string;
    image: File;
  };

  export type Output = PlantOutput;

  export class UseCase implements IUseCase<Input, Output> {
    public constructor(
      private readonly plantRepository: PlantRepository.Repository,
      private readonly uploadService: UploadService,
    ) {}

    public async execute(input: Input): Promise<Output> {
      const { id, image } = input;

      if (!image) {
        throw new BadRequestError('Add an image to the plant.');
      }

      const entity = await this.plantRepository.find({ id });

      await this.uploadService.removeFile(entity.image, 'plant');
      const imagePath = await this.uploadService.saveFile(image, 'plant');

      entity.updateImage(imagePath);
      const plant = await this.plantRepository.update(entity);

      return PlantOutputMapper.toOutput(plant);
    }
  }
}
