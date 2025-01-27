import { NotFoundError } from '@domain/errors/not-found-error';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentLand = createParamDecorator(
  (data: string | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const landId = request.headers['land-id'];

    if (!landId) {
      throw new NotFoundError('Land ID is missing from headers.');
    }

    return landId;
  },
);
