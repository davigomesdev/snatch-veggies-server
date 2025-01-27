import { BlockTypeEnum } from '@core/enums/block-type.enum';

import { ClassValidatorFields } from '@domain/validators/class-validator-fields';

import { BlockProps } from './block.entity';
import { IsBoolean, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

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

  @Min(1)
  @IsInt()
  @IsOptional()
  public limit?: number;

  @IsEnum(BlockTypeEnum)
  @IsNotEmpty()
  public type: BlockTypeEnum;

  @IsBoolean()
  @IsOptional()
  public isVisible?: boolean;

  @IsString()
  @IsNotEmpty()
  public image: string;

  public constructor(props: BlockProps) {
    Object.assign(this, { ...props });
  }
}

export class BlockValidator extends ClassValidatorFields<UseRules> {
  public validate(data: UseRules): boolean {
    return super.validate(new UseRules(data ?? ({} as BlockProps)));
  }
}

export class BlockValidatorFactory {
  public static create(): BlockValidator {
    return new BlockValidator();
  }
}
