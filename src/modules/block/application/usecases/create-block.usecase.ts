import { File } from '@nest-lab/fastify-multer';

import { BlockTypeEnum } from '@core/enums/block-type.enum';

import { UploadService } from '@infrastructure/upload/upload.service';

import { IUseCase } from '@application/usecases/use-case.interface';

import { BlockEntity } from '@modules/block/domain/block.entity';
import { BlockRepository } from '@modules/block/domain/block.repository';
import { BlockOutput, BlockOutputMapper } from '../output/block.output';
import { BadRequestError } from '@domain/errors/bad-request-error';

export namespace CreateBlockUseCase {
  export type Input = {
    index: number;
    name: string;
    price: number;
    limit: number;
    type: BlockTypeEnum;
    isVisible: boolean;
    image: File;
  };

  export type Output = BlockOutput;

  export class UseCase implements IUseCase<Input, Output> {
    public constructor(
      private readonly blockRepository: BlockRepository.Repository,
      private readonly uploadService: UploadService,
    ) {}

    public async execute(input: Input): Promise<Output> {
      const { image, ...rest } = input;

      if (!image) {
        throw new BadRequestError('Add an image to the block.');
      }

      await this.blockRepository.indexExists(input.index);
      const imagePath = await this.uploadService.saveFile(image, 'block');

      const entity = new BlockEntity({
        ...rest,
        image: imagePath,
      });
      const block = await this.blockRepository.create(entity);

      return BlockOutputMapper.toOutput(block);
    }
  }
}
