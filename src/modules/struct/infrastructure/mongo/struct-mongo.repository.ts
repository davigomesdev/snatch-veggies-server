import { NotFoundError } from '@domain/errors/not-found-error';
import { ConflictError } from '@domain/errors/conflict-error';

import { Injectable } from '@nestjs/common';

import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { StructModel } from './struct-mongo.model';
import { StructEntity } from '@modules/struct/domain/struct.entity';
import { StructRepository } from '@modules/struct/domain/struct.repository';

@Injectable()
export class StructMongoRepository implements StructRepository.Repository {
  public constructor(@InjectModel('struct') private readonly structModel: Model<StructModel>) {}

  public async indexExists(index: number): Promise<void> {
    const decoration = await this.structModel.findOne({ index });

    if (decoration) {
      throw new ConflictError('This index struct has already been registered.');
    }
  }

  public async find(params: StructRepository.FindParams): Promise<StructEntity> {
    const decoration = await this.structModel.findOne({
      ...(params.id && { _id: params.id }),
      ...(params.index !== undefined && { index: params.index }),
      ...(params.isVisible !== undefined && { isVisible: params.isVisible }),
    });

    if (!decoration) {
      throw new NotFoundError('Struct not found.');
    }

    return StructModel.toEntity(decoration);
  }

  public async findAll(params: StructRepository.FindAllParams): Promise<StructEntity[]> {
    const structs = await this.structModel
      .find({
        ...(params.isVisible !== undefined && { isVisible: params.isVisible }),
      })
      .sort({ index: 1 });
    return structs.map(StructModel.toEntity);
  }

  public async create(data: StructEntity): Promise<StructEntity> {
    const { id, ...rest } = data.toJSON();
    const struct = await this.structModel.create({
      _id: id,
      ...rest,
    });
    return StructModel.toEntity(struct);
  }

  public async update(data: StructEntity): Promise<StructEntity> {
    const { id, ...rest } = data.toJSON();
    const struct = await this.structModel.findOneAndUpdate({ _id: id }, { ...rest }, { new: true });
    return StructModel.toEntity(struct);
  }

  public async delete(params: StructRepository.FindParams): Promise<void> {
    await this.structModel.deleteOne(params);
  }
}
