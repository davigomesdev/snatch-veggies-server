import { EntityValidationError } from '@domain/errors/validation-error';
import { PlantInventoryValidatorFactory } from './plant-inventory.validator';

import { Entity } from '@domain/entities/entity';
import { PlantEntity } from '@modules/plant/domain/plant.entity';

export type PlantInventoryProps = {
  landId: string;
  plantId: string;
  amount: number;
  inUse: number;
  harvest: number;
};

export class PlantInventoryEntity extends Entity<PlantInventoryProps, PlantEntity> {
  public constructor(
    public readonly props: PlantInventoryProps,
    id?: string,
  ) {
    PlantInventoryEntity.validate(props);
    super(props, id);
  }

  public get landId(): string {
    return this.props.landId;
  }

  public get plantId(): string {
    return this.props.plantId;
  }

  public get amount(): number {
    return this.props.amount;
  }

  public get inUse(): number {
    return this.props.inUse;
  }

  public get harvest(): number {
    return this.props.harvest;
  }

  private set landId(value: string) {
    this.props.landId = value;
  }

  private set plantId(value: string) {
    this.props.plantId = value;
  }

  private set amount(value: number) {
    this.props.amount = value;
  }

  private set inUse(value: number) {
    this.props.inUse = value;
  }

  private set harvest(value: number) {
    this.props.harvest = value;
  }

  public updateAmount(value: number): PlantInventoryEntity {
    PlantInventoryEntity.validate({
      ...this.props,
      amount: value,
    });

    this.amount = value;
    return this;
  }

  public updateInUse(value: number): PlantInventoryEntity {
    PlantInventoryEntity.validate({
      ...this.props,
      inUse: value,
    });

    this.inUse = value;
    return this;
  }

  public updateHarvest(value: number): PlantInventoryEntity {
    PlantInventoryEntity.validate({
      ...this.props,
      harvest: value,
    });

    this.harvest = value;
    return this;
  }

  private static validate(props: PlantInventoryProps): void {
    const validator = PlantInventoryValidatorFactory.create();
    const isValid = validator.validate(props);
    if (!isValid) {
      throw new EntityValidationError(validator.errors);
    }
  }
}
