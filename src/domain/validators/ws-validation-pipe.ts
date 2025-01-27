import { WsBadRequestError } from '@domain/ws-errors/ws-bad-request-error';

import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { ValidationPipe, ArgumentMetadata, Injectable, Type } from '@nestjs/common';

@Injectable()
export class WsValidationPipe extends ValidationPipe {
  public async transform(value: any, { metatype }: ArgumentMetadata): Promise<any> {
    if (!metatype || !this.shouldValidate(metatype)) {
      return value;
    }

    const object = plainToInstance(metatype, value);
    const errors = await validate(object);

    if (errors.length > 0) {
      throw new WsBadRequestError('Validation failed');
    }

    return value;
  }

  private shouldValidate(metatype: Type<unknown>): boolean {
    const primitives = [String, Boolean, Number, Array, Object];
    return !primitives.includes(metatype as any);
  }
}
