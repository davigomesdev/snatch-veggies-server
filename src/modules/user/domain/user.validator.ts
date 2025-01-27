import { ClassValidatorFields } from '@domain/validators/class-validator-fields';

import { UserProps } from './user.entity';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class UseRules {
  @IsString()
  @IsNotEmpty()
  public address: string;

  @IsString()
  @IsNotEmpty()
  public nonce: string;

  @Min(0)
  @IsInt()
  @IsOptional()
  public gold?: number;

  @IsString()
  @IsOptional()
  public refreshToken?: string | null;

  public constructor(props: UserProps) {
    Object.assign(this, { ...props });
  }
}

export class UserValidator extends ClassValidatorFields<UseRules> {
  public validate(data: UseRules): boolean {
    return super.validate(new UseRules(data ?? ({} as UserProps)));
  }
}

export class UserValidatorFactory {
  public static create(): UserValidator {
    return new UserValidator();
  }
}
