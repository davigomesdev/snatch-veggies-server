import { NotFoundError } from '@domain/errors/not-found-error';
import { ConflictError } from '@domain/errors/conflict-error';

import { Injectable } from '@nestjs/common';

import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { UserModel } from './user-mongo.model';
import { UserEntity } from '@modules/user/domain/user.entity';
import { UserRepository } from '@modules/user/domain/user.repository';

@Injectable()
export class UserMongoRepository implements UserRepository.Repository {
  public constructor(@InjectModel('user') private readonly userModel: Model<UserModel>) {}

  public async isExists(address: string): Promise<boolean> {
    const user = await this.userModel.findOne({ address });

    if (user) {
      return true;
    }

    return false;
  }

  public async addressExists(address: string): Promise<void> {
    const user = await this.userModel.findOne({ address });

    if (user) {
      throw new ConflictError('This address has already been registered.');
    }
  }

  public async find(params: UserRepository.FindParams): Promise<UserEntity> {
    const user = await this.userModel.findOne({
      ...(params.id && { _id: params.id }),
      ...(params.address && { address: params.address }),
    });

    if (!user) {
      throw new NotFoundError('User not found.');
    }

    return UserModel.toEntity(user);
  }

  public async findAll(params: UserRepository.FindAllParams): Promise<UserEntity[]> {
    const users = await this.userModel.find(params);
    return users.map(UserModel.toEntity);
  }

  public async create(data: UserEntity): Promise<UserEntity> {
    const { id, ...rest } = data.toJSON();
    const user = await this.userModel.create({
      _id: id,
      ...rest,
    });
    return UserModel.toEntity(user);
  }

  public async update(data: UserEntity): Promise<UserEntity> {
    const { id, ...rest } = data.toJSON();
    const user = await this.userModel.findOneAndUpdate({ _id: id }, { ...rest }, { new: true });
    return UserModel.toEntity(user);
  }

  public async delete(params: UserRepository.FindParams): Promise<void> {
    await this.userModel.deleteOne(params);
  }
}
