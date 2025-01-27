import { Entity } from '@domain/entities/entity';

export type FindParams = {
  id?: string;
  landId?: string;
};

export type FindAllParams = {
  landId?: string;
};

export interface IRepository<
  E extends Entity,
  FindInput = FindParams,
  FindAllInput = FindAllParams,
> {
  create(entity: E): Promise<E>;
  find(params: FindInput): Promise<E>;
  findAll(params?: FindAllInput): Promise<E[]>;
  update(entity: E): Promise<E>;
  delete(params: FindInput): Promise<void>;
}
