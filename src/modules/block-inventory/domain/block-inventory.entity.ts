import { EntityValidationError } from '@domain/errors/validation-error';
import { BlockInventoryValidatorFactory } from './block-inventory.validator';

import { Entity } from '@domain/entities/entity';
import { BlockEntity } from '@modules/block/domain/block.entity';

export type BlockInventoryProps = {
  landId: string;
  blockId: string;
  amount: number;
  inUse: number;
};

export class BlockInventoryEntity extends Entity<BlockInventoryProps, BlockEntity> {
  public constructor(
    public readonly props: BlockInventoryProps,
    id?: string,
  ) {
    BlockInventoryEntity.validate(props);
    super(props, id);
  }

  public get landId(): string {
    return this.props.landId;
  }

  public get blockId(): string {
    return this.props.blockId;
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

  private set blockId(value: string) {
    this.props.blockId = value;
  }

  private set amount(value: number) {
    this.props.amount = value;
  }

  private set inUse(value: number) {
    this.props.inUse = value;
  }

  public updateAmount(value: number): BlockInventoryEntity {
    BlockInventoryEntity.validate({
      ...this.props,
      amount: value,
    });

    this.amount = value;
    return this;
  }

  public updateInUse(value: number): BlockInventoryEntity {
    BlockInventoryEntity.validate({
      ...this.props,
      inUse: value,
    });

    this.inUse = value;
    return this;
  }

  private static validate(props: BlockInventoryProps): void {
    const validator = BlockInventoryValidatorFactory.create();
    const isValid = validator.validate(props);
    if (!isValid) {
      throw new EntityValidationError(validator.errors);
    }
  }
}
