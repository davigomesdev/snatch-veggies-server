import { EntityValidationError } from '@domain/errors/validation-error';
import { DecorationInventoryValidatorFactory } from './decoration-inventory.validator';

import { Entity } from '@domain/entities/entity';
import { DecorationEntity } from '@modules/decoration/domain/decoration.entity';

export type DecorationInventoryProps = {
  landId: string;
  decorationId: string;
  amount: number;
  inUse: number;
};

export class DecorationInventoryEntity extends Entity<DecorationInventoryProps, DecorationEntity> {
  public constructor(
    public readonly props: DecorationInventoryProps,
    id?: string,
  ) {
    DecorationInventoryEntity.validate(props);
    super(props, id);
  }

  public get landId(): string {
    return this.props.landId;
  }

  public get decorationId(): string {
    return this.props.decorationId;
  }

  public get amount(): number {
    return this.props.amount;
  }

  public get inUse(): number {
    return this.props.inUse;
  }

  private set landId(value: string) {
    this.props.landId = value;
  }

  private set decorationId(value: string) {
    this.props.decorationId = value;
  }

  private set amount(value: number) {
    this.props.amount = value;
  }

  private set inUse(value: number) {
    this.props.inUse = value;
  }

  public updateAmount(value: number): DecorationInventoryEntity {
    DecorationInventoryEntity.validate({
      ...this.props,
      amount: value,
    });

    this.amount = value;
    return this;
  }

  public updateInUse(value: number): DecorationInventoryEntity {
    DecorationInventoryEntity.validate({
      ...this.props,
      inUse: value,
    });

    this.inUse = value;
    return this;
  }

  private static validate(props: DecorationInventoryProps): void {
    const validator = DecorationInventoryValidatorFactory.create();
    const isValid = validator.validate(props);
    if (!isValid) {
      throw new EntityValidationError(validator.errors);
    }
  }
}
