import { File } from '@nest-lab/fastify-multer';

import { IsNotEmpty, IsString } from 'class-validator';

import { UpdateFishImageUseCase } from '../usecases/update-fish-image.usecase';

export class UpdateFishImageDTO implements UpdateFishImageUseCase.Input {
  @IsString()
  @IsNotEmpty()
  public id: string;

  public image: File;
}
