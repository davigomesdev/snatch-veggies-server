import { ClassValidatorFields } from '@domain/validators/class-validator-fields';

import { BlockInventoryProps } from './block-inventory.entity';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class UseRules {
  @IsString()
  @IsNotEmpty()
  public landId: string;

  @IsString()
  @IsNotEmpty()
  public blockId: string;

  @Min(0)
  @IsInt()
  @IsNotEmpty()
  public amount: number;

  @Min(0)
  @IsInt()
  @IsNotEmpty()
  public inUse: number;

  public constructor(props: BlockInventoryProps) {
    Object.assign(this, { ...props });
  }
}

export class BlockInventoryValidator extends ClassValidatorFields<UseRules> {
  public validate(data: UseRules): boolean {
    return super.validate(new UseRules(data ?? ({} as BlockInventoryProps)));
  }
}

export class BlockInventoryValidatorFactory {
  public static create(): BlockInventoryValidator {
    return new BlockInventoryValidator();
  }
}
