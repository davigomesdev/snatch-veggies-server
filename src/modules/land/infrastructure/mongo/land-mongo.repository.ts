import { NotFoundError } from '@domain/errors/not-found-error';

import { Injectable } from '@nestjs/common';

import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { LandModel } from './land-mongo.model';
import { LandEntity } from '@modules/land/domain/land.entity';
import { LandRepository } from '@modules/land/domain/land.repository';

@Injectable()
export class LandMongoRepository implements LandRepository.Repository {
  public constructor(@InjectModel('land') private readonly landModel: Model<LandModel>) {}

  public async isExists(tokenId: number): Promise<boolean> {
    const land = await this.landModel.findOne({ tokenId });

    if (!land) return false;

    return true;
  }

  public async find(params: LandRepository.FindParams): Promise<LandEntity> {
    const land = await this.landModel.findOne({
      ...(params.id && { _id: params.id }),
      ...(params.userId && { userId: params.userId }),
      ...(params.tokenId !== undefined && { tokenId: params.tokenId }),
    });

    if (!land) {
      throw new NotFoundError('Land not found.');
    }

    return LandModel.toEntity(land);
  }

  public async findAll(params: LandRepository.FindAllParams): Promise<LandEntity[]> {
    const lands = await this.landModel.find(params);
    return lands.map(LandModel.toEntity);
  }

  public async create(data: LandEntity): Promise<LandEntity> {
    const { id, ...rest } = data.toJSON();
    const land = await this.landModel.create({
      _id: id,
      ...rest,
    });
    return LandModel.toEntity(land);
  }

  public async update(data: LandEntity): Promise<LandEntity> {
    const { id, ...rest } = data.toJSON();
    const land = await this.landModel.findOneAndUpdate({ _id: id }, { ...rest }, { new: true });
    return LandModel.toEntity(land);
  }

  public async delete(params: LandRepository.FindParams): Promise<void> {
    await this.landModel.deleteOne(params);
  }
}
