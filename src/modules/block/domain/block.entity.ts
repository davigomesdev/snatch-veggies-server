import { BlockTypeEnum } from '@core/enums/block-type.enum';

import { EntityValidationError } from '@domain/errors/validation-error';
import { BlockValidatorFactory } from './block.validator';

import { Entity } from '@domain/entities/entity';

export type BlockProps = {
  index: number;
  name: string;
  price?: number;
  limit?: number;
  type: BlockTypeEnum;
  isVisible?: boolean;
  image: string;
};

export class BlockEntity extends Entity<BlockProps> {
  public constructor(
    public readonly props: BlockProps,
    id?: string,
  ) {
    BlockEntity.validate(props);
    super(props, id);
    this.props.price = this.props.price ?? 0;
    this.props.limit = this.props.limit ?? 3600;
    this.props.isVisible = this.props.isVisible ?? true;
  }

  public get index(): number {
    return this.props.index;
  }

  public get name(): string {
    return this.props.name;
  }

  public get price(): number {
    return this.props.price;
  }

  public get limit(): number {
    return this.props.limit;
  }

  public get type(): BlockTypeEnum {
    return this.props.type;
  }

  public get isVisible(): boolean {
    return this.props.isVisible;
  }

  public get image(): string {
    return this.props.image;
  }

  private set index(value: number) {
    this.props.index = value;
  }

  private set name(value: string) {
    this.props.name = value;
  }

  private set limit(value: number) {
    this.props.limit = value;
  }

  private set price(value: number) {
    this.props.price = value;
  }

  private set type(value: BlockTypeEnum) {
    this.props.type = value;
  }

  private set isVisible(value: boolean) {
    this.props.isVisible = value;
  }

  private set image(value: string) {
    this.props.image = value;
  }

  public update(props: Partial<BlockEntity>): BlockEntity {
    BlockEntity.validate({
      ...this.props,
      ...props,
    });

    this.index = props.index;
    this.name = props.name;
    this.price = props.price;
    this.limit = props.limit;
    this.type = props.type;
    this.isVisible = props.isVisible;

    return this;
  }

  public updateImage(value: string): void {
    BlockEntity.validate({
      ...this.props,
      image: value,
    });

    this.image = value;
  }

  private static validate(props: BlockProps): void {
    const validator = BlockValidatorFactory.create();
    const isValid = validator.validate(props);
    if (!isValid) {
      throw new EntityValidationError(validator.errors);
    }
  }
}
