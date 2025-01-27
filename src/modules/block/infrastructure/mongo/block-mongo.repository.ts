import { NotFoundError } from '@domain/errors/not-found-error';
import { ConflictError } from '@domain/errors/conflict-error';

import { Injectable } from '@nestjs/common';

import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { BlockModel } from './block-mongo.model';
import { BlockEntity } from '@modules/block/domain/block.entity';
import { BlockRepository } from '@modules/block/domain/block.repository';

@Injectable()
export class BlockMongoRepository implements BlockRepository.Repository {
  public constructor(@InjectModel('block') private readonly blockModel: Model<BlockModel>) {}

  public async indexExists(index: number): Promise<void> {
    const block = await this.blockModel.findOne({ index });

    if (block) {
      throw new ConflictError('This index block has already been registered.');
    }
  }

  public async find(params: BlockRepository.FindParams): Promise<BlockEntity> {
    const block = await this.blockModel.findOne({
      ...(params.id && { _id: params.id }),
      ...(params.index !== undefined && { index: params.index }),
      ...(params.isVisible !== undefined && { isVisible: params.isVisible }),
    });

    if (!block) {
      throw new NotFoundError('Block not found.');
    }

    return BlockModel.toEntity(block);
  }

  public async findAll(params: BlockRepository.FindAllParams): Promise<BlockEntity[]> {
    const blocks = await this.blockModel
      .find({
        ...(params.isVisible !== undefined && { isVisible: params.isVisible }),
      })
      .sort({ index: 1 });
    return blocks.map(BlockModel.toEntity);
  }

  public async create(data: BlockEntity): Promise<BlockEntity> {
    const { id, ...rest } = data.toJSON();
    const block = await this.blockModel.create({
      _id: id,
      ...rest,
    });
    return BlockModel.toEntity(block);
  }

  public async update(data: BlockEntity): Promise<BlockEntity> {
    const { id, ...rest } = data.toJSON();
    const block = await this.blockModel.findOneAndUpdate({ _id: id }, { ...rest }, { new: true });
    return BlockModel.toEntity(block);
  }

  public async delete(params: BlockRepository.FindParams): Promise<void> {
    await this.blockModel.deleteOne(params);
  }
}
