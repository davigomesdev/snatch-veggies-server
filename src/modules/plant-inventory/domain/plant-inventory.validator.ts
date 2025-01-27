import { ClassValidatorFields } from '@domain/validators/class-validator-fields';

import { PlantInventoryProps } from './plant-inventory.entity';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class UseRules {
  @IsString()
  @IsNotEmpty()
  public landId: string;

  @IsString()
  @IsNotEmpty()
  public plantId: string;

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
  public harvest: number;

  public constructor(props: PlantInventoryProps) {
    Object.assign(this, { ...props });
  }
}

export class PlantInventoryValidator extends ClassValidatorFields<UseRules> {
  public validate(data: UseRules): boolean {
    return super.validate(new UseRules(data ?? ({} as PlantInventoryProps)));
  }
}

export class PlantInventoryValidatorFactory {
  public static create(): PlantInventoryValidator {
    return new PlantInventoryValidator();
  }
}
