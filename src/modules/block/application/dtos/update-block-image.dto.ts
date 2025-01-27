import { File } from '@nest-lab/fastify-multer';

import { IsNotEmpty, IsString } from 'class-validator';

import { UpdateBlockImageUseCase } from '../usecases/update-block-image.usecase';

export class UpdateBlockImageDTO implements UpdateBlockImageUseCase.Input {
  @IsString()
  @IsNotEmpty()
  public id: string;

  public image: File;
}
