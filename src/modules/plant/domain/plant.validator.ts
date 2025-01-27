import { ClassValidatorFields } from '@domain/validators/class-validator-fields';

import { PlantProps } from './plant.entity';
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class UseRules {
  @Min(0)
  @IsInt()
  @IsNotEmpty()
  public index: number;

  @IsString()
  @IsNotEmpty()
  public name: string;

  @Min(0)
  @IsInt()
  @IsOptional()
  public price?: number;

  @Min(0)
  @IsInt()
  @IsOptional()
  public profit?: number;

  @Min(1)
  @IsInt()
  @IsNotEmpty()
  public duration: number;

  @Min(1)
  @IsInt()
  @IsOptional()
  public exp?: number;

  @IsBoolean()
  @IsOptional()
  public isVisible?: boolean;

  @IsString()
  @IsNotEmpty()
  public image: string;

  public constructor(props: PlantProps) {
    Object.assign(this, { ...props });
  }
}

export class PlantValidator extends ClassValidatorFields<UseRules> {
  public validate(data: UseRules): boolean {
    return super.validate(new UseRules(data ?? ({} as PlantProps)));
  }
}

export class PlantValidatorFactory {
  public static create(): PlantValidator {
    return new PlantValidator();
  }
}
