import { NotFoundError } from '@domain/errors/not-found-error';
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { FastifyReply } from 'fastify';

@Catch(NotFoundError)
export class NotFoundErrorFilter implements ExceptionFilter {
  public catch(exception: NotFoundError, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();

    response.status(404).send({
      statusCode: 404,
      error: 'Not Found',
      message: exception.message,
    });
  }
}
