import { NotFoundError } from '@domain/errors/not-found-error';

import { Injectable } from '@nestjs/common';

import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { FishModel } from './fish-mongo.model';
import { FishEntity } from '@modules/fish/domain/fish.entity';
import { FishRepository } from '@modules/fish/domain/fish.repository';

@Injectable()
export class FishMongoRepository implements FishRepository.Repository {
  public constructor(@InjectModel('fish') private readonly fishModel: Model<FishModel>) {}

  public async find(params: FishRepository.FindParams): Promise<FishEntity> {
    const fish = await this.fishModel.findOne({
      ...(params.id && { _id: params.id }),
    });

    if (!fish) {
      throw new NotFoundError('Fish not found.');
    }

    return FishModel.toEntity(fish);
  }

  public async findAll(params: FishRepository.FindAllParams): Promise<FishEntity[]> {
    const fishes = await this.fishModel.find(params).sort({ rarity: 1 });
    return fishes.map(FishModel.toEntity);
  }

  public async create(data: FishEntity): Promise<FishEntity> {
    const { id, ...rest } = data.toJSON();
    const fish = await this.fishModel.create({
      _id: id,
      ...rest,
    });
    return FishModel.toEntity(fish);
  }

  public async update(data: FishEntity): Promise<FishEntity> {
    const { id, ...rest } = data.toJSON();
    const fish = await this.fishModel.findOneAndUpdate({ _id: id }, { ...rest }, { new: true });
    return FishModel.toEntity(fish);
  }

  public async delete(params: FishRepository.FindParams): Promise<void> {
    await this.fishModel.deleteOne(params);
  }
}
