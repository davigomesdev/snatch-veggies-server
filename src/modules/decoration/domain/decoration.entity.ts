import { TVector2 } from '@core/types/vector2.type';

import { EntityValidationError } from '@domain/errors/validation-error';
import { DecorationValidatorFactory } from './decoration.validator';

import { Entity } from '@domain/entities/entity';

export type DecorationProps = {
  index: number;
  name: string;
  price?: number;
  limit?: number;
  size?: TVector2;
  isVisible?: boolean;
  image: string;
};

export class DecorationEntity extends Entity<DecorationProps> {
  public constructor(
    public readonly props: DecorationProps,
    id?: string,
  ) {
    DecorationEntity.validate(props);
    super(props, id);
    this.props.price = this.props.price ?? 0;
    this.props.limit = this.props.limit ?? 100;
    this.props.size = this.props.size ?? { x: 1, y: 1 };
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

  public get size(): TVector2 {
    return this.props.size;
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

  private set price(value: number) {
    this.props.price = value;
  }

  private set limit(value: number) {
    this.props.limit = value;
  }

  private set size(value: TVector2) {
    this.props.size = value;
  }

  private set isVisible(value: boolean) {
    this.props.isVisible = value;
  }

  private set image(value: string) {
    this.props.image = value;
  }

  public update(props: Partial<DecorationEntity>): DecorationEntity {
    DecorationEntity.validate({
      ...this.props,
      ...props,
    });

    this.index = props.index;
    this.name = props.name;
    this.price = props.price;
    this.limit = props.limit;
    this.size = props.size;
    this.isVisible = props.isVisible;

    return this;
  }

  public updateImage(value: string): void {
    DecorationEntity.validate({
      ...this.props,
      image: value,
    });

    this.image = value;
  }

  private static validate(props: DecorationProps): void {
    const validator = DecorationValidatorFactory.create();
    const isValid = validator.validate(props);
    if (!isValid) {
      throw new EntityValidationError(validator.errors);
    }
  }
}
