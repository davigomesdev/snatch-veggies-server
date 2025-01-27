import { NotFoundError } from '@domain/errors/not-found-error';

import { Injectable } from '@nestjs/common';

import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { DecorationModel } from '@modules/decoration/infrastructure/mongo/decoration-mongo.model';

import { DecorationInventoryModel } from './decoration-inventory-mongo.model';
import { DecorationInventoryEntity } from '@modules/decoration-inventory/domain/decoration-inventory.entity';
import { DecorationInventoryRepository } from '@modules/decoration-inventory/domain/decoration-inventory.repository';

@Injectable()
export class DecorationInventoryMongoRepository
  implements DecorationInventoryRepository.Repository
{
  public constructor(
    @InjectModel('decorationInventory')
    private readonly decorationInventoryModel: Model<DecorationInventoryModel>,
  ) {}

  public async isExists(landId: string, decorationId: string): Promise<boolean> {
    const decorationInventory = await this.decorationInventoryModel.findOne({
      landId,
      decorationId,
    });

    if (!decorationInventory) return false;

    return true;
  }

  public async find(
    params: DecorationInventoryRepository.FindParams,
  ): Promise<DecorationInventoryEntity> {
    const query = this.decorationInventoryModel.findOne({
      ...(params.id && { _id: params.id }),
      ...(params.landId && { landId: params.landId }),
      ...(params.decorationId && { decorationId: params.decorationId }),
    });

    if (params.decoration === true) {
      query.populate('decorationId');
    }

    const decorationInventory = await query;

    if (!decorationInventory) {
      throw new NotFoundError('Decoration inventory not found.');
    }

    return DecorationInventoryModel.toEntity(decorationInventory);
  }

  public async findAll(
    params: DecorationInventoryRepository.FindAllParams,
  ): Promise<DecorationInventoryEntity[]> {
    const query = this.decorationInventoryModel.find({
      ...(params.landId && { landId: params.landId }),
      ...(params.decorationId && { decorationId: params.decorationId }),
    });

    if (params.isVisible !== undefined) {
      query.populate({
        path: 'decorationId',
        match: { isVisible: params.isVisible },
      });
    } else if (params.decoration === true) {
      query.populate('decorationId');
    }

    const decorationInventories = await query;

    const validInventories =
      params.isVisible !== undefined
        ? decorationInventories.filter((inventory) => inventory.decorationId !== null)
        : decorationInventories;

    const sortedInventories = validInventories.sort((a, b) => {
      const decorationA = a.decorationId as DecorationModel;
      const decorationB = b.decorationId as DecorationModel;

      if (!decorationA || !decorationB) return 0;
      return (decorationA.index || 0) - (decorationB.index || 0);
    });

    return sortedInventories.map(DecorationInventoryModel.toEntity);
  }

  public async create(data: DecorationInventoryEntity): Promise<DecorationInventoryEntity> {
    const { id, ...rest } = data.toJSON();
    const decorationInventory = await this.decorationInventoryModel.create({
      _id: id,
      ...rest,
    });
    return DecorationInventoryModel.toEntity(decorationInventory);
  }

  public async createMany(data: DecorationInventoryEntity[]): Promise<DecorationInventoryEntity[]> {
    const documents = data.map((item) => {
      const { id, ...rest } = item.toJSON();
      return { _id: id, ...rest };
    });

    const decorationInventories = await this.decorationInventoryModel.insertMany(documents);
    return decorationInventories.map(DecorationInventoryModel.toEntity);
  }

  public async update(data: DecorationInventoryEntity): Promise<DecorationInventoryEntity> {
    const { id, ...rest } = data.toJSON();
    const decorationInventory = await this.decorationInventoryModel.findOneAndUpdate(
      { _id: id },
      { ...rest },
      { new: true },
    );
    return DecorationInventoryModel.toEntity(decorationInventory);
  }

  public async delete(params: DecorationInventoryRepository.FindParams): Promise<void> {
    await this.decorationInventoryModel.deleteOne(params);
  }
}
