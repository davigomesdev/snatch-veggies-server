import { EntityValidationError } from '@domain/errors/validation-error';
import { FishInventoryValidatorFactory } from './fish-inventory.validator';

import { Entity } from '@domain/entities/entity';
import { FishEntity } from '@modules/fish/domain/fish.entity';

export type FishInventoryProps = {
  landId: string;
  fishId: string;
  amount: number;
};

export class FishInventoryEntity extends Entity<FishInventoryProps, FishEntity> {
  public constructor(
    public readonly props: FishInventoryProps,
    id?: string,
  ) {
    FishInventoryEntity.validate(props);
    super(props, id);
  }

  public get landId(): string {
    return this.props.landId;
  }

  public get fishId(): string {
    return this.props.fishId;
  }

  public get amount(): number {
    return this.props.amount;
  }

  private set landId(value: string) {
    this.props.landId = value;
  }

  private set fishId(value: string) {
    this.props.fishId = value;
  }

  private set amount(value: number) {
    this.props.amount = value;
  }

  public updateAmount(value: number): FishInventoryEntity {
    FishInventoryEntity.validate({
      ...this.props,
      amount: value,
    });

    this.amount = value;
    return this;
  }

  private static validate(props: FishInventoryProps): void {
    const validator = FishInventoryValidatorFactory.create();
    const isValid = validator.validate(props);
    if (!isValid) {
      throw new EntityValidationError(validator.errors);
    }
  }
}
