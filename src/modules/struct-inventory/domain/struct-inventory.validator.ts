import { ClassValidatorFields } from '@domain/validators/class-validator-fields';

import { StructInventoryProps } from './struct-inventory.entity';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class UseRules {
  @IsString()
  @IsNotEmpty()
  public landId: string;

  @IsString()
  @IsNotEmpty()
  public structId: string;

  @Min(0)
  @IsInt()
  @IsNotEmpty()
  public amount: number;

  @Min(0)
  @IsInt()
  @IsNotEmpty()
  public inUse: number;

  @Min(0)
  @IsInt()
  @IsNotEmpty()
  public minted: number;

  public constructor(props: StructInventoryProps) {
    Object.assign(this, { ...props });
  }
}

export class StructInventoryValidator extends ClassValidatorFields<UseRules> {
  public validate(data: UseRules): boolean {
    return super.validate(new UseRules(data ?? ({} as StructInventoryProps)));
  }
}

export class StructInventoryValidatorFactory {
  public static create(): StructInventoryValidator {
    return new StructInventoryValidator();
  }
}
