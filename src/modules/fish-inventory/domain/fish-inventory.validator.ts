import { ClassValidatorFields } from '@domain/validators/class-validator-fields';

import { FishInventoryProps } from './fish-inventory.entity';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class UseRules {
  @IsString()
  @IsNotEmpty()
  public landId: string;

  @IsString()
  @IsNotEmpty()
  public fishId: string;

  @Min(0)
  @IsInt()
  @IsNotEmpty()
  public amount: number;

  public constructor(props: FishInventoryProps) {
    Object.assign(this, { ...props });
  }
}

export class FishInventoryValidator extends ClassValidatorFields<UseRules> {
  public validate(data: UseRules): boolean {
    return super.validate(new UseRules(data ?? ({} as FishInventoryProps)));
  }
}

export class FishInventoryValidatorFactory {
  public static create(): FishInventoryValidator {
    return new FishInventoryValidator();
  }
}
