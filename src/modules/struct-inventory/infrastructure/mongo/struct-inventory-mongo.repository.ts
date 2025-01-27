import { NotFoundError } from '@domain/errors/not-found-error';

import { Injectable } from '@nestjs/common';

import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { StructModel } from '@modules/struct/infrastructure/mongo/struct-mongo.model';

import { StructInventoryModel } from './struct-inventory-mongo.model';
import { StructInventoryEntity } from '@modules/struct-inventory/domain/struct-inventory.entity';
import { StructInventoryRepository } from '@modules/struct-inventory/domain/struct-inventory.repository';

@Injectable()
export class StructInventoryMongoRepository implements StructInventoryRepository.Repository {
  public constructor(
    @InjectModel('structInventory')
    private readonly structInventoryModel: Model<StructInventoryModel>,
  ) {}

  public async isExists(landId: string, structId: string): Promise<boolean> {
    const structInventory = await this.structInventoryModel.findOne({
      landId,
      structId,
    });

    if (!structInventory) return false;

    return true;
  }

  public async find(params: StructInventoryRepository.FindParams): Promise<StructInventoryEntity> {
    const query = this.structInventoryModel.findOne({
      ...(params.id && { _id: params.id }),
      ...(params.landId && { landId: params.landId }),
      ...(params.structId && { structId: params.structId }),
    });

    if (params.struct === true) {
      query.populate('structId');
    }

    const structInventory = await query;

    if (!structInventory) {
      throw new NotFoundError('Struct inventory not found.');
    }

    return StructInventoryModel.toEntity(structInventory);
  }

  public async findAll(
    params: StructInventoryRepository.FindAllParams,
  ): Promise<StructInventoryEntity[]> {
    const query = this.structInventoryModel.find({
      ...(params.landId && { landId: params.landId }),
      ...(params.structId && { structId: params.structId }),
    });

    if (params.isVisible !== undefined) {
      query.populate({
        path: 'structId',
        match: { isVisible: params.isVisible },
      });
    } else if (params.struct === true) {
      query.populate('structId');
    }

    const structInventories = await query;

    const validInventories =
      params.isVisible !== undefined
        ? structInventories.filter((inventory) => inventory.structId !== null)
        : structInventories;

    const sortedInventories = validInventories.sort((a, b) => {
      const structA = a.structId as StructModel;
      const structB = b.structId as StructModel;

      if (!structA || !structB) return 0;
      return (structA.index || 0) - (structB.index || 0);
    });

    return sortedInventories.map(StructInventoryModel.toEntity);
  }

  public async create(data: StructInventoryEntity): Promise<StructInventoryEntity> {
    const { id, ...rest } = data.toJSON();
    const structInventory = await this.structInventoryModel.create({
      _id: id,
      ...rest,
    });
    return StructInventoryModel.toEntity(structInventory);
  }

  public async update(data: StructInventoryEntity): Promise<StructInventoryEntity> {
    const { id, ...rest } = data.toJSON();
    const structInventory = await this.structInventoryModel.findOneAndUpdate(
      { _id: id },
      { ...rest },
      { new: true },
    );
    return StructInventoryModel.toEntity(structInventory);
  }

  public async delete(params: StructInventoryRepository.FindParams): Promise<void> {
    await this.structInventoryModel.deleteOne(params);
  }
}
