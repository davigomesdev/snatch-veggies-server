import * as bcrypt from 'bcrypt';

import { EntityValidationError } from '@domain/errors/validation-error';
import { UserValidatorFactory } from './user.validator';

import { Entity } from '@domain/entities/entity';

export type UserProps = {
  address: string;
  nonce: string;
  gold?: number;
  refreshToken?: string | null;
};

export class UserEntity extends Entity<UserProps> {
  public constructor(
    public readonly props: UserProps,
    id?: string,
  ) {
    UserEntity.validate(props);
    super(props, id);
    this.props.gold = this.props.gold ?? 0;
    this.props.refreshToken = this.props.refreshToken || null;
  }

  public get address(): string {
    return this.props.address;
  }

  public get nonce(): string {
    return this.props.nonce;
  }

  public get gold(): number {
    return this.props.gold;
  }

  public get refreshToken(): string | null {
    return this.props.refreshToken;
  }

  private set address(value: string) {
    this.props.address = value;
  }

  private set nonce(value: string) {
    this.props.nonce = value;
  }

  private set gold(value: number) {
    this.props.gold = value;
  }

  private set refreshToken(value: string | null) {
    this.props.refreshToken = value;
  }

  public updateGold(value: number): void {
    UserEntity.validate({
      ...this.props,
      gold: value,
    });

    this.gold = value;
  }

  public updateNonce(value: string): void {
    UserEntity.validate({
      ...this.props,
      nonce: value,
    });

    this.nonce = value;
  }

  public async updateRefreshToken(value: string): Promise<UserEntity> {
    const hash = await UserEntity.generateRefreshToken(value);

    UserEntity.validate({
      ...this.props,
      refreshToken: hash,
    });

    this.refreshToken = hash;

    return this;
  }

  private static validate(props: UserProps): void {
    const validator = UserValidatorFactory.create();
    const isValid = validator.validate(props);
    if (!isValid) {
      throw new EntityValidationError(validator.errors);
    }
  }

  private static async generateRefreshToken(data: string): Promise<string> {
    return await bcrypt.hash(data, 10);
  }
}
