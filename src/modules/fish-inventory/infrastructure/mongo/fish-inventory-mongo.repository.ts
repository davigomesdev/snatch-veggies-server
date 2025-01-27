import { NotFoundError } from '@domain/errors/not-found-error';

import { Injectable } from '@nestjs/common';

import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { FishModel } from '@modules/fish/infrastructure/mongo/fish-mongo.model';

import { FishInventoryModel } from './fish-inventory-mongo.model';
import { FishInventoryEntity } from '@modules/fish-inventory/domain/fish-inventory.entity';
import { FishInventoryRepository } from '@modules/fish-inventory/domain/fish-inventory.repository';

@Injectable()
export class FishInventoryMongoRepository implements FishInventoryRepository.Repository {
  public constructor(
    @InjectModel('fishInventory')
    private readonly fishInventoryModel: Model<FishInventoryModel>,
  ) {}

  public async isExists(landId: string, fishId: string): Promise<boolean> {
    const fishInventory = await this.fishInventoryModel.findOne({
      landId,
      fishId,
    });

    if (!fishInventory) return false;

    return true;
  }

  public async find(params: FishInventoryRepository.FindParams): Promise<FishInventoryEntity> {
    const query = this.fishInventoryModel.findOne({
      ...(params.id && { _id: params.id }),
      ...(params.landId && { landId: params.landId }),
      ...(params.fishId && { fishId: params.fishId }),
    });

    if (params.fish === true) {
      query.populate('fishId');
    }

    const fishInventory = await query;

    if (!fishInventory) {
      throw new NotFoundError('Fish inventory not found.');
    }

    return FishInventoryModel.toEntity(fishInventory);
  }

  public async findAll(
    params: FishInventoryRepository.FindAllParams,
  ): Promise<FishInventoryEntity[]> {
    const query = this.fishInventoryModel.find({
      ...(params.landId && { landId: params.landId }),
      ...(params.fishId && { fishId: params.fishId }),
    });

    if (params.fish === true) {
      query.populate('fishId');
    }

    const fishInventories = await query;

    const sortedInventories = fishInventories.sort((a, b) => {
      const fishA = a.fishId as FishModel;
      const fishB = b.fishId as FishModel;

      if (!fishA || !fishB) return 0;
      return (fishA.rarity || 0) - (fishB.rarity || 0);
    });

    return sortedInventories.map(FishInventoryModel.toEntity);
  }

  public async create(data: FishInventoryEntity): Promise<FishInventoryEntity> {
    const { id, ...rest } = data.toJSON();
    const fishInventory = await this.fishInventoryModel.create({
      _id: id,
      ...rest,
    });
    return FishInventoryModel.toEntity(fishInventory);
  }

  public async update(data: FishInventoryEntity): Promise<FishInventoryEntity> {
    const { id, ...rest } = data.toJSON();
    const fishInventory = await this.fishInventoryModel.findOneAndUpdate(
      { _id: id },
      { ...rest },
      { new: true },
    );
    return FishInventoryModel.toEntity(fishInventory);
  }

  public async delete(params: FishInventoryRepository.FindParams): Promise<void> {
    await this.fishInventoryModel.deleteOne(params);
  }
}
