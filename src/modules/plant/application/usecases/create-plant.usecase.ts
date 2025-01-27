import { File } from '@nest-lab/fastify-multer';

import { BadRequestError } from '@domain/errors/bad-request-error';

import { UploadService } from '@infrastructure/upload/upload.service';

import { IUseCase } from '@application/usecases/use-case.interface';

import { PlantEntity } from '@modules/plant/domain/plant.entity';
import { PlantRepository } from '@modules/plant/domain/plant.repository';
import { PlantOutput, PlantOutputMapper } from '../output/plant.output';

export namespace CreatePlantUseCase {
  export type Input = {
    index: number;
    name: string;
    price?: number;
    profit?: number;
    duration: number;
    exp?: number;
    isVisible: boolean;
    image: File;
  };

  export type Output = PlantOutput;

  export class UseCase implements IUseCase<Input, Output> {
    public constructor(
      private readonly plantRepository: PlantRepository.Repository,
      private readonly uploadService: UploadService,
    ) {}

    public async execute(input: Input): Promise<Output> {
      const { image, ...rest } = input;

      if (!image) {
        throw new BadRequestError('Add an image to the plant.');
      }

      await this.plantRepository.indexExists(input.index);
      const imagePath = await this.uploadService.saveFile(image, 'plant');

      const entity = new PlantEntity({
        ...rest,
        image: imagePath,
      });
      const plant = await this.plantRepository.create(entity);

      return PlantOutputMapper.toOutput(plant);
    }
  }
}
