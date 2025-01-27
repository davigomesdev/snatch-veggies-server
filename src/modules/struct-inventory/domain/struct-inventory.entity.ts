import { EntityValidationError } from '@domain/errors/validation-error';
import { StructInventoryValidatorFactory } from './struct-inventory.validator';

import { Entity } from '@domain/entities/entity';
import { StructEntity } from '@modules/struct/domain/struct.entity';

export type StructInventoryProps = {
  landId: string;
  structId: string;
  amount: number;
  inUse: number;
  minted: number;
};

export class StructInventoryEntity extends Entity<StructInventoryProps, StructEntity> {
  public constructor(
    public readonly props: StructInventoryProps,
    id?: string,
  ) {
    StructInventoryEntity.validate(props);
    super(props, id);
  }

  public get landId(): string {
    return this.props.landId;
  }

  public get structId(): string {
    return this.props.structId;
  }

  public get amount(): number {
    return this.props.amount;
  }

  public get inUse(): number {
    return this.props.inUse;
  }

  public get minted(): number {
    return this.props.minted;
  }

  private set landId(value: string) {
    this.props.landId = value;
  }

  private set structId(value: string) {
    this.props.structId = value;
  }

  private set amount(value: number) {
    this.props.amount = value;
  }

  private set inUse(value: number) {
    this.props.inUse = value;
  }

  private set minted(value: number) {
    this.props.minted = value;
  }

  public updateAmount(value: number): StructInventoryEntity {
    StructInventoryEntity.validate({
      ...this.props,
      amount: value,
    });

    this.amount = value;
    return this;
  }

  public updateInUse(value: number): StructInventoryEntity {
    StructInventoryEntity.validate({
      ...this.props,
      inUse: value,
    });

    this.inUse = value;
    return this;
  }

  public updateMinted(value: number): StructInventoryEntity {
    StructInventoryEntity.validate({
      ...this.props,
      minted: value,
    });

    this.minted = value;
    return this;
  }

  private static validate(props: StructInventoryProps): void {
    const validator = StructInventoryValidatorFactory.create();
    const isValid = validator.validate(props);
    if (!isValid) {
      throw new EntityValidationError(validator.errors);
    }
  }
}
