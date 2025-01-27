import { TVector2 } from '@core/types/vector2.type';

import { ClassValidatorFields } from '@domain/validators/class-validator-fields';

import { StructProps } from './struct.entity';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class Vector2Validator {
  @Min(1)
  @IsInt()
  @IsNotEmpty()
  public x: number;

  @Min(1)
  @IsInt()
  @IsNotEmpty()
  public y: number;
}

export class UseRules {
  @Min(0)
  @IsInt()
  @IsNotEmpty()
  public index: number;

  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsString()
  @IsNotEmpty()
  public itemName: string;

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
  @IsOptional()
  public limit?: number;

  @Min(1)
  @IsInt()
  @IsOptional()
  public exp?: number;

  @Min(1)
  @IsInt()
  @IsNotEmpty()
  public duration: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => Vector2Validator)
  public size?: TVector2;

  @IsBoolean()
  @IsOptional()
  public isVisible?: boolean;

  @IsString()
  @IsNotEmpty()
  public image: string;

  @IsString()
  @IsOptional()
  public itemImage?: string | null;

  public constructor(props: StructProps) {
    Object.assign(this, { ...props });
  }
}

export class StructValidator extends ClassValidatorFields<UseRules> {
  public validate(data: UseRules): boolean {
    return super.validate(new UseRules(data ?? ({} as StructProps)));
  }
}

export class StructValidatorFactory {
  public static create(): StructValidator {
    return new StructValidator();
  }
}
