import { ClassValidatorFields } from '@domain/validators/class-validator-fields';

import { FishProps } from './fish.entity';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class UseRules {
  @IsString()
  @IsNotEmpty()
  public name: string;

  @Min(0)
  @IsInt()
  @IsOptional()
  public price?: number;

  @Min(1)
  @IsInt()
  @IsNotEmpty()
  public rarity: number;

  @IsString()
  @IsNotEmpty()
  public image: string;

  public constructor(props: FishProps) {
    Object.assign(this, { ...props });
  }
}

export class FishValidator extends ClassValidatorFields<UseRules> {
  public validate(data: UseRules): boolean {
    return super.validate(new UseRules(data ?? ({} as FishProps)));
  }
}

export class FishValidatorFactory {
  public static create(): FishValidator {
    return new FishValidator();
  }
}
