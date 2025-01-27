import { File } from '@nest-lab/fastify-multer';

import { IsNotEmpty, IsString } from 'class-validator';

import { UpdateDecorationImageUseCase } from '../usecases/update-decoration-image.usecase';

export class UpdateDecorationImageDTO implements UpdateDecorationImageUseCase.Input {
  @IsString()
  @IsNotEmpty()
  public id: string;

  public image: File;
}
