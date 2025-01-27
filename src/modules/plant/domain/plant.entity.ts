import { EntityValidationError } from '@domain/errors/validation-error';
import { PlantValidatorFactory } from './plant.validator';

import { Entity } from '@domain/entities/entity';

export type PlantProps = {
  index: number;
  name: string;
  price?: number;
  profit?: number;
  duration: number;
  exp?: number;
  isVisible?: boolean;
  image: string;
};

export class PlantEntity extends Entity<PlantProps> {
  public constructor(
    public readonly props: PlantProps,
    id?: string,
  ) {
    PlantEntity.validate(props);
    super(props, id);
    this.props.price = this.props.price ?? 0;
    this.props.profit = this.props.profit ?? 0;
    this.props.exp = this.props.exp ?? 1;
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

  public get profit(): number {
    return this.props.profit;
  }

  public get duration(): number {
    return this.props.duration;
  }

  public get exp(): number {
    return this.props.exp;
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

  private set profit(value: number) {
    this.props.profit = value;
  }

  private set duration(value: number) {
    this.props.duration = value;
  }

  private set exp(value: number) {
    this.props.exp = value;
  }

  private set isVisible(value: boolean) {
    this.props.isVisible = value;
  }

  private set image(value: string) {
    this.props.image = value;
  }

  public update(props: Partial<PlantEntity>): PlantEntity {
    PlantEntity.validate({
      ...this.props,
      ...props,
    });

    this.index = props.index;
    this.name = props.name;
    this.price = props.price;
    this.duration = props.duration;
    this.exp = props.exp;
    this.isVisible = props.isVisible;

    return this;
  }

  public updateImage(value: string): void {
    PlantEntity.validate({
      ...this.props,
      image: value,
    });

    this.image = value;
  }

  private static validate(props: PlantProps): void {
    const validator = PlantValidatorFactory.create();
    const isValid = validator.validate(props);
    if (!isValid) {
      throw new EntityValidationError(validator.errors);
    }
  }
}
