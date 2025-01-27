import { File } from '@nest-lab/fastify-multer';

import { IsNotEmpty, IsString } from 'class-validator';

import { UpdatePlantImageUseCase } from '../usecases/update-plant-image.usecase';

export class UpdatePlantImageDTO implements UpdatePlantImageUseCase.Input {
  @IsString()
  @IsNotEmpty()
  public id: string;

  public image: File;
}
