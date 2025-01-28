import { EntityValidationError } from '@domain/errors/validation-error';
import { LandValidatorFactory } from './land.validator';

import { Entity } from '@domain/entities/entity';
import { UserEntity } from '@modules/user/domain/user.entity';

export type LandProps = {
  userId: string;
  referrerId?: string | null;
  tokenId: number;
  name: string;
  exp?: number;
  lastTheftDate?: Date;
  lastStolenDate?: Date;
  theftCount?: number;
  stolenCount?: number;
};

export class LandEntity extends Entity<LandProps, UserEntity> {
  public constructor(
    public readonly props: LandProps,
    id?: string,
  ) {
    LandEntity.validate(props);
    super(props, id);
    this.props.referrerId = this.props.referrerId || null;
    this.props.exp = this.props.exp ?? 0;
    this.props.lastTheftDate = this.props.lastTheftDate ?? new Date();
    this.props.lastStolenDate = this.props.lastStolenDate ?? new Date();
    this.props.theftCount = this.props.theftCount ?? 0;
    this.props.stolenCount = this.props.stolenCount ?? 0;
  }

  public get userId(): string {
    return this.props.userId;
  }

  public get referrerId(): string | null {
    return this.props.referrerId;
  }

  public get tokenId(): number {
    return this.props.tokenId;
  }

  public get name(): string {
    return this.props.name;
  }

  public get exp(): number {
    return this.props.exp;
  }

  public get lastTheftDate(): Date {
    return this.props.lastTheftDate;
  }

  public get lastStolenDate(): Date {
    return this.props.lastStolenDate;
  }

  public get theftCount(): number {
    return this.props.theftCount;
  }

  public get stolenCount(): number {
    return this.props.stolenCount;
  }

  private set userId(value: string) {
    this.props.userId = value;
  }

  private set referrerId(value: string | null) {
    this.props.referrerId = value;
  }

  private set tokenId(value: number) {
    this.props.tokenId = value;
  }

  private set name(value: string) {
    this.props.name = value;
  }

  private set exp(value: number) {
    this.props.exp = value;
  }

  private set lastTheftDate(value: Date) {
    this.props.lastTheftDate = value;
  }

  private set lastStolenDate(value: Date) {
    this.props.lastStolenDate = value;
  }

  private set theftCount(value: number) {
    this.props.theftCount = value;
  }

  private set stolenCount(value: number) {
    this.props.stolenCount = value;
  }

  public updateUserId(value: string): LandEntity {
    LandEntity.validate({
      ...this.props,
      userId: value,
    });

    this.userId = value;
    return this;
  }

  public updateReferrerId(value: string | null): LandEntity {
    LandEntity.validate({
      ...this.props,
      referrerId: value,
    });

    this.referrerId = value;
    return this;
  }

  public updateName(value: string): LandEntity {
    LandEntity.validate({
      ...this.props,
      name: value,
    });

    this.name = value;
    return this;
  }

  public updateExp(value: number): LandEntity {
    LandEntity.validate({
      ...this.props,
      exp: value,
    });

    this.exp = value;
    return this;
  }

  public updateLastTheftDate(value: Date): LandEntity {
    LandEntity.validate({
      ...this.props,
      lastTheftDate: value,
    });

    this.lastTheftDate = value;
    return this;
  }

  public updateLastStolenDate(value: Date): LandEntity {
    LandEntity.validate({
      ...this.props,
      lastStolenDate: value,
    });

    this.lastStolenDate = value;
    return this;
  }

  public updateTheftCount(value: number): LandEntity {
    LandEntity.validate({
      ...this.props,
      theftCount: value,
    });

    this.theftCount = value;
    return this;
  }

  public updateStolenCount(value: number): LandEntity {
    LandEntity.validate({
      ...this.props,
      stolenCount: value,
    });

    this.stolenCount = value;
    return this;
  }

  private static validate(props: LandProps): void {
    const validator = LandValidatorFactory.create();
    const isValid = validator.validate(props);
    if (!isValid) {
      throw new EntityValidationError(validator.errors);
    }
  }
}
