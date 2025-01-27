import { TVector2 } from '@core/types/vector2.type';

import { EntityValidationError } from '@domain/errors/validation-error';
import { StructValidatorFactory } from './struct.validator';

import { Entity } from '@domain/entities/entity';

export type StructProps = {
  index: number;
  name: string;
  itemName: string;
  price?: number;
  profit?: number;
  limit?: number;
  exp?: number;
  duration: number;
  size?: TVector2;
  isVisible?: boolean;
  image: string;
  itemImage?: string;
};

export class StructEntity extends Entity<StructProps> {
  public constructor(
    public readonly props: StructProps,
    id?: string,
  ) {
    StructEntity.validate(props);
    super(props, id);
    this.props.price = this.props.price ?? 0;
    this.props.profit = this.props.profit ?? 0;
    this.props.limit = this.props.limit ?? 1;
    this.props.exp = this.props.exp ?? 1;
    this.props.size = this.props.size ?? { x: 1, y: 1 };
    this.props.itemImage = this.props.itemImage || null;
    this.props.isVisible = this.props.isVisible ?? true;
  }

  public get index(): number {
    return this.props.index;
  }

  public get name(): string {
    return this.props.name;
  }

  public get itemName(): string {
    return this.props.itemName;
  }

  public get price(): number {
    return this.props.price;
  }

  public get profit(): number {
    return this.props.profit;
  }

  public get limit(): number {
    return this.props.limit;
  }

  public get exp(): number {
    return this.props.exp;
  }

  public get duration(): number {
    return this.props.duration;
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

  public get itemImage(): string | null {
    return this.props.itemImage;
  }

  private set index(value: number) {
    this.props.index = value;
  }

  private set name(value: string) {
    this.props.name = value;
  }

  private set itemName(value: string) {
    this.props.itemName = value;
  }

  private set price(value: number) {
    this.props.price = value;
  }

  private set profit(value: number) {
    this.props.profit = value;
  }

  private set limit(value: number) {
    this.props.limit = value;
  }

  private set exp(value: number) {
    this.props.exp = value;
  }

  private set duration(value: number) {
    this.props.duration = value;
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

  private set itemImage(value: string) {
    this.props.itemImage = value;
  }

  public update(props: Partial<StructEntity>): StructEntity {
    StructEntity.validate({
      ...this.props,
      ...props,
    });

    this.index = props.index;
    this.name = props.name;
    this.itemName = props.itemName;
    this.price = props.price;
    this.profit = props.profit;
    this.limit = props.limit;
    this.exp = props.exp;
    this.duration = props.duration;
    this.size = props.size;
    this.isVisible = props.isVisible;

    return this;
  }

  public updateImage(value: string): void {
    StructEntity.validate({
      ...this.props,
      image: value,
    });

    this.image = value;
  }

  public updateItemImage(value: string): void {
    StructEntity.validate({
      ...this.props,
      itemImage: value,
    });

    this.itemImage = value;
  }

  private static validate(props: StructProps): void {
    const validator = StructValidatorFactory.create();
    const isValid = validator.validate(props);
    if (!isValid) {
      throw new EntityValidationError(validator.errors);
    }
  }
}
