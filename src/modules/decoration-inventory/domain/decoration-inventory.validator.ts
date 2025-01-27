import { ClassValidatorFields } from '@domain/validators/class-validator-fields';

import { DecorationInventoryProps } from './decoration-inventory.entity';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class UseRules {
  @IsString()
  @IsNotEmpty()
  public landId: string;

  @IsString()
  @IsNotEmpty()
  public decorationId: string;

  @Min(0)
  @IsInt()
  @IsNotEmpty()
  public amount: number;

  @Min(0)
  @IsInt()
  @IsNotEmpty()
  public inUse: number;

  public constructor(props: DecorationInventoryProps) {
    Object.assign(this, { ...props });
  }
}

export class DecorationInventoryValidator extends ClassValidatorFields<UseRules> {
  public validate(data: UseRules): boolean {
    return super.validate(new UseRules(data ?? ({} as DecorationInventoryProps)));
  }
}

export class DecorationInventoryValidatorFactory {
  public static create(): DecorationInventoryValidator {
    return new DecorationInventoryValidator();
  }
}
