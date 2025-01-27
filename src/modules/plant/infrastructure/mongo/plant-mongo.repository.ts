import { NotFoundError } from '@domain/errors/not-found-error';
import { ConflictError } from '@domain/errors/conflict-error';

import { Injectable } from '@nestjs/common';

import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { PlantModel } from './plant-mongo.model';
import { PlantEntity } from '@modules/plant/domain/plant.entity';
import { PlantRepository } from '@modules/plant/domain/plant.repository';

@Injectable()
export class PlantMongoRepository implements PlantRepository.Repository {
  public constructor(@InjectModel('plant') private readonly plantModel: Model<PlantModel>) {}

  public async indexExists(index: number): Promise<void> {
    const plant = await this.plantModel.findOne({ index });

    if (plant) {
      throw new ConflictError('This index plant has already been registered.');
    }
  }

  public async find(params: PlantRepository.FindParams): Promise<PlantEntity> {
    const plant = await this.plantModel.findOne({
      ...(params.id && { _id: params.id }),
      ...(params.index !== undefined && { index: params.index }),
      ...(params.isVisible !== undefined && { isVisible: params.isVisible }),
    });

    if (!plant) {
      throw new NotFoundError('Plant not found.');
    }

    return PlantModel.toEntity(plant);
  }

  public async findAll(params: PlantRepository.FindAllParams): Promise<PlantEntity[]> {
    const plants = await this.plantModel
      .find({
        ...(params.isVisible !== undefined && { isVisible: params.isVisible }),
      })
      .sort({ index: 1 });
    return plants.map(PlantModel.toEntity);
  }

  public async create(data: PlantEntity): Promise<PlantEntity> {
    const { id, ...rest } = data.toJSON();
    const plant = await this.plantModel.create({
      _id: id,
      ...rest,
    });
    return PlantModel.toEntity(plant);
  }

  public async update(data: PlantEntity): Promise<PlantEntity> {
    const { id, ...rest } = data.toJSON();
    const plant = await this.plantModel.findOneAndUpdate({ _id: id }, { ...rest }, { new: true });
    return PlantModel.toEntity(plant);
  }

  public async delete(params: PlantRepository.FindParams): Promise<void> {
    await this.plantModel.deleteOne(params);
  }
}
