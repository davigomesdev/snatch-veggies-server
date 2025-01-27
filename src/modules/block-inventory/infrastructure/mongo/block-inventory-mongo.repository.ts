import { NotFoundError } from '@domain/errors/not-found-error';

import { Injectable } from '@nestjs/common';

import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { BlockModel } from '@modules/block/infrastructure/mongo/block-mongo.model';

import { BlockInventoryModel } from './block-inventory-mongo.model';
import { BlockInventoryEntity } from '@modules/block-inventory/domain/block-inventory.entity';
import { BlockInventoryRepository } from '@modules/block-inventory/domain/block-inventory.repository';

@Injectable()
export class BlockInventoryMongoRepository implements BlockInventoryRepository.Repository {
  public constructor(
    @InjectModel('blockInventory') private readonly blockInventoryModel: Model<BlockInventoryModel>,
  ) {}

  public async isExists(landId: string, blockId: string): Promise<boolean> {
    const block = await this.blockInventoryModel.findOne({
      landId,
      blockId,
    });

    if (!block) return false;

    return true;
  }

  public async find(params: BlockInventoryRepository.FindParams): Promise<BlockInventoryEntity> {
    const query = this.blockInventoryModel.findOne({
      ...(params.id && { _id: params.id }),
      ...(params.landId && { landId: params.landId }),
      ...(params.blockId && { blockId: params.blockId }),
    });

    if (params.block === true) {
      query.populate('blockId');
    }

    const blockInventory = await query;

    if (!blockInventory) {
      throw new NotFoundError('Block inventory not found.');
    }

    return BlockInventoryModel.toEntity(blockInventory);
  }

  public async findAll(
    params: BlockInventoryRepository.FindAllParams,
  ): Promise<BlockInventoryEntity[]> {
    const query = this.blockInventoryModel.find({
      ...(params.landId && { landId: params.landId }),
      ...(params.blockId && { blockId: params.blockId }),
    });

    if (params.isVisible !== undefined) {
      query.populate({
        path: 'blockId',
        match: { isVisible: params.isVisible },
      });
    } else if (params.block === true) {
      query.populate('blockId');
    }

    const blockInventories = await query;

    const validInventories =
      params.isVisible !== undefined
        ? blockInventories.filter((inventory) => inventory.blockId !== null)
        : blockInventories;

    const sortedInventories = validInventories.sort((a, b) => {
      const blockA = a.blockId as BlockModel;
      const decorationB = b.blockId as BlockModel;

      if (!blockA || !decorationB) return 0;
      return (blockA.index || 0) - (decorationB.index || 0);
    });

    return sortedInventories.map(BlockInventoryModel.toEntity);
  }

  public async create(data: BlockInventoryEntity): Promise<BlockInventoryEntity> {
    const { id, ...rest } = data.toJSON();
    const blockInventory = await this.blockInventoryModel.create({
      _id: id,
      ...rest,
    });
    return BlockInventoryModel.toEntity(blockInventory);
  }

  public async createMany(data: BlockInventoryEntity[]): Promise<BlockInventoryEntity[]> {
    const documents = data.map((item) => {
      const { id, ...rest } = item.toJSON();
      return { _id: id, ...rest };
    });

    const blockInventories = await this.blockInventoryModel.insertMany(documents);
    return blockInventories.map(BlockInventoryModel.toEntity);
  }

  public async update(data: BlockInventoryEntity): Promise<BlockInventoryEntity> {
    const { id, ...rest } = data.toJSON();
    const blockInventory = await this.blockInventoryModel.findOneAndUpdate(
      { _id: id },
      { ...rest },
      { new: true },
    );
    return BlockInventoryModel.toEntity(blockInventory);
  }

  public async delete(params: BlockInventoryRepository.FindParams): Promise<void> {
    await this.blockInventoryModel.deleteOne(params);
  }
}
