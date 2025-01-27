import { NotFoundError } from '@domain/errors/not-found-error';
import { ConflictError } from '@domain/errors/conflict-error';

import { Injectable } from '@nestjs/common';

import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { DecorationModel } from './decoration-mongo.model';
import { DecorationEntity } from '@modules/decoration/domain/decoration.entity';
import { DecorationRepository } from '@modules/decoration/domain/decoration.repository';

@Injectable()
export class DecorationMongoRepository implements DecorationRepository.Repository {
  public constructor(
    @InjectModel('decoration') private readonly decorationModel: Model<DecorationModel>,
  ) {}

  public async indexExists(index: number): Promise<void> {
    const decoration = await this.decorationModel.findOne({ index });

    if (decoration) {
      throw new ConflictError('This index decoration has already been registered.');
    }
  }

  public async find(params: DecorationRepository.FindParams): Promise<DecorationEntity> {
    const decoration = await this.decorationModel.findOne({
      ...(params.id && { _id: params.id }),
      ...(params.index !== undefined && { index: params.index }),
      ...(params.isVisible !== undefined && { isVisible: params.isVisible }),
    });

    if (!decoration) {
      throw new NotFoundError('Decoration not found.');
    }

    return DecorationModel.toEntity(decoration);
  }

  public async findAll(params: DecorationRepository.FindAllParams): Promise<DecorationEntity[]> {
    const decorations = await this.decorationModel
      .find({
        ...(params.isVisible !== undefined && { isVisible: params.isVisible }),
      })
      .sort({ index: 1 });
    return decorations.map(DecorationModel.toEntity);
  }

  public async create(data: DecorationEntity): Promise<DecorationEntity> {
    const { id, ...rest } = data.toJSON();
    const decoration = await this.decorationModel.create({
      _id: id,
      ...rest,
    });
    return DecorationModel.toEntity(decoration);
  }

  public async update(data: DecorationEntity): Promise<DecorationEntity> {
    const { id, ...rest } = data.toJSON();
    const decoration = await this.decorationModel.findOneAndUpdate(
      { _id: id },
      { ...rest },
      { new: true },
    );
    return DecorationModel.toEntity(decoration);
  }

  public async delete(params: DecorationRepository.FindParams): Promise<void> {
    await this.decorationModel.deleteOne(params);
  }
}
