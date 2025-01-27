import { ErrorPacketTypeEnum } from '@core/enums/packets-type.enum';
import { WsUnauthorizedError } from '@domain/ws-errors/ws-unauthorized-error';
import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';

@Catch(WsUnauthorizedError)
export class WsUnauthorizedErrorFilter implements ExceptionFilter {
  public catch(exception: WsUnauthorizedError, host: ArgumentsHost): any {
    const client = host.switchToWs().getClient();
    const error = exception.getError();

    client.emit(ErrorPacketTypeEnum.UNAUTHORIZED_ERROR, {
      statusCode: 401,
      error: 'Unauthorized',
      message: error,
    });
  }
}
