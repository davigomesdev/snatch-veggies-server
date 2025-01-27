import { File } from '@nest-lab/fastify-multer';

import { IsNotEmpty, IsString } from 'class-validator';

import { UpdateStructImageUseCase } from '../usecases/update-struct-image.usecase';

export class UpdateStructImageDTO implements UpdateStructImageUseCase.Input {
  @IsString()
  @IsNotEmpty()
  public id: string;

  public image: File;
}
