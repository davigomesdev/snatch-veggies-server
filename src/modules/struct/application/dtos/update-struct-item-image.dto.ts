import { File } from '@nest-lab/fastify-multer';

import { IsNotEmpty, IsString } from 'class-validator';

import { UpdateStructItemImageUseCase } from '../usecases/update-struct-item-image.usecase';

export class UpdateStructItemImageDTO implements UpdateStructItemImageUseCase.Input {
  @IsString()
  @IsNotEmpty()
  public id: string;

  public image: File;
}
