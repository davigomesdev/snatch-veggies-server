import { ClassValidatorFields } from '@domain/validators/class-validator-fields';

import { IsDate, IsInt, IsNotEmpty, IsOptional, IsString, Length, Min } from 'class-validator';

import { LandProps } from './land.entity';

export class UseRules {
  @IsString()
  @IsNotEmpty()
  public userId: string;

  @IsString()
  @IsOptional()
  public referrerId?: string;

  @IsInt()
  @IsNotEmpty()
  public tokenId: number;

  @Length(3, 255)
  @IsString()
  @IsNotEmpty()
  public name: string;

  @Min(0)
  @IsInt()
  @IsOptional()
  public exp?: number;

  @IsDate()
  @IsOptional()
  public lastTheftDate?: Date;

  @IsDate()
  @IsOptional()
  public lastStolenDate?: Date;

  @Min(0)
  @IsInt()
  @IsOptional()
  public theftCount?: number;

  @Min(0)
  @IsInt()
  @IsOptional()
  public stolenCount?: number;

  public constructor(props: LandProps) {
    Object.assign(this, { ...props });
  }
}

export class LandValidator extends ClassValidatorFields<UseRules> {
  public validate(data: UseRules): boolean {
    return super.validate(new UseRules(data ?? ({} as LandProps)));
  }
}

export class LandValidatorFactory {
  public static create(): LandValidator {
    return new LandValidator();
  }
}
