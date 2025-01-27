import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';

import { Reflector } from '@nestjs/core';
import { WrapperDataInterceptor } from '@adapters/interceptors/wrapper-data.interceptor';

import { ConflictErrorFilter } from '@adapters/error-filter/conflict-error.filter';
import { NotFoundErrorFilter } from '@adapters/error-filter/not-found-error.filter';
import { LimitExceededErrorFilter } from '@adapters/error-filter/limit-exceeded-error.filter';
import { BadRequestErrorFilter } from '@adapters/error-filter/bad-request-error.filter';
import { InvalidPasswordErrorFilter } from '@adapters/error-filter/invalid-password-error.filter';
import { InvalidCredentialsErrorFilter } from '@adapters/error-filter/invalid-credentials-error.filter';

export const applyGlobalConfig = (app: NestFastifyApplication): void => {
  app.useGlobalPipes(
    new ValidationPipe({
      errorHttpStatusCode: 422,
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalInterceptors(
    new WrapperDataInterceptor(),
    new ClassSerializerInterceptor(app.get(Reflector)),
  );

  app.useGlobalFilters(
    new ConflictErrorFilter(),
    new NotFoundErrorFilter(),
    new BadRequestErrorFilter(),
    new LimitExceededErrorFilter(),
    new InvalidPasswordErrorFilter(),
    new InvalidCredentialsErrorFilter(),
  );
};
