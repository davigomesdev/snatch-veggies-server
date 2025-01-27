import { EntityValidationError } from '@domain/errors/validation-error';
import { FishValidatorFactory } from './fish.validator';

import { Entity } from '@domain/entities/entity';

export type FishProps = {
  name: string;
  price?: number;
  rarity: number;
  image: string;
};

export class FishEntity extends Entity<FishProps> {
  public constructor(
    public readonly props: FishProps,
    id?: string,
  ) {
    FishEntity.validate(props);
    super(props, id);
    this.props.price = this.props.price ?? 0;
  }

  public get name(): string {
    return this.props.name;
  }

  public get price(): number {
    return this.props.price;
  }

  public get rarity(): number {
    return this.props.rarity;
  }

  public get image(): string {
    return this.props.image;
  }

  private set name(value: string) {
    this.props.name = value;
  }

  private set price(value: number) {
    this.props.price = value;
  }

  private set rarity(value: number) {
    this.props.rarity = value;
  }

  private set image(value: string) {
    this.props.image = value;
  }

  public update(props: Partial<FishEntity>): FishEntity {
    FishEntity.validate({
      ...this.props,
      ...props,
    });

    this.name = props.name;
    this.price = props.price;
    this.rarity = props.rarity;

    return this;
  }

  public updateImage(value: string): void {
    FishEntity.validate({
      ...this.props,
      image: value,
    });

    this.image = value;
  }

  private static validate(props: FishProps): void {
    const validator = FishValidatorFactory.create();
    const isValid = validator.validate(props);
    if (!isValid) {
      throw new EntityValidationError(validator.errors);
    }
  }
}
