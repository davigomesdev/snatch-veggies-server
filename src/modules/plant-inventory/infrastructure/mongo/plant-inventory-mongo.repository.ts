import { NotFoundError } from '@domain/errors/not-found-error';

import { Injectable } from '@nestjs/common';

import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { PlantModel } from '@modules/plant/infrastructure/mongo/plant-mongo.model';

import { PlantInventoryModel } from './plant-inventory-mongo.model';
import { PlantInventoryEntity } from '@modules/plant-inventory/domain/plant-inventory.entity';
import { PlantInventoryRepository } from '@modules/plant-inventory/domain/plant-inventory.repository';

@Injectable()
export class PlantInventoryMongoRepository implements PlantInventoryRepository.Repository {
  public constructor(
    @InjectModel('plantInventory')
    private readonly plantInventoryModel: Model<PlantInventoryModel>,
  ) {}

  public async isExists(landId: string, plantId: string): Promise<boolean> {
    const plantInventory = await this.plantInventoryModel.findOne({
      landId,
      plantId,
    });

    if (!plantInventory) return false;

    return true;
  }

  public async find(params: PlantInventoryRepository.FindParams): Promise<PlantInventoryEntity> {
    const query = this.plantInventoryModel.findOne({
      ...(params.id && { _id: params.id }),
      ...(params.landId && { landId: params.landId }),
      ...(params.plantId && { plantId: params.plantId }),
    });

    if (params.plant === true) {
      query.populate('plantId');
    }

    const plantInventory = await query;

    if (!plantInventory) {
      throw new NotFoundError('Plant inventory not found.');
    }

    return PlantInventoryModel.toEntity(plantInventory);
  }

  public async findAll(
    params: PlantInventoryRepository.FindAllParams,
  ): Promise<PlantInventoryEntity[]> {
    const query = this.plantInventoryModel.find({
      ...(params.landId && { landId: params.landId }),
      ...(params.plantId && { plantId: params.plantId }),
    });

    if (params.isVisible !== undefined) {
      query.populate({
        path: 'plantId',
        match: { isVisible: params.isVisible },
      });
    } else if (params.plant === true) {
      query.populate('plantId');
    }

    const plantInventories = await query;

    const validInventories =
      params.isVisible !== undefined
        ? plantInventories.filter((inventory) => inventory.plantId !== null)
        : plantInventories;

    const sortedInventories = validInventories.sort((a, b) => {
      const plantA = a.plantId as PlantModel;
      const plantB = b.plantId as PlantModel;

      if (!plantA || !plantB) return 0;
      return (plantA.index || 0) - (plantB.index || 0);
    });

    return sortedInventories.map(PlantInventoryModel.toEntity);
  }

  public async create(data: PlantInventoryEntity): Promise<PlantInventoryEntity> {
    const { id, ...rest } = data.toJSON();
    const plantInventory = await this.plantInventoryModel.create({
      _id: id,
      ...rest,
    });
    return PlantInventoryModel.toEntity(plantInventory);
  }

  public async update(data: PlantInventoryEntity): Promise<PlantInventoryEntity> {
    const { id, ...rest } = data.toJSON();
    const plantInventory = await this.plantInventoryModel.findOneAndUpdate(
      { _id: id },
      { ...rest },
      { new: true },
    );
    return PlantInventoryModel.toEntity(plantInventory);
  }

  public async delete(params: PlantInventoryRepository.FindParams): Promise<void> {
    await this.plantInventoryModel.deleteOne(params);
  }
}
