import { LimitExceededError } from '@domain/errors/limit-exceeded-error';
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { FastifyReply } from 'fastify';

@Catch(LimitExceededError)
export class LimitExceededErrorFilter implements ExceptionFilter {
  public catch(exception: LimitExceededError, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();

    response.status(400).send({
      statusCode: 400,
      error: 'Limit Exceeded Error',
      message: exception.message,
    });
  }
}
