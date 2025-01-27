import { ErrorPacketTypeEnum } from '@core/enums/packets-type.enum';
import { WsNotFoundError } from '@domain/ws-errors/ws-not-found-error';
import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';

@Catch(WsNotFoundError)
export class WsNotFoundErrorFilter implements ExceptionFilter {
  public catch(exception: WsNotFoundError, host: ArgumentsHost): any {
    const client = host.switchToWs().getClient();
    const error = exception.getError();

    client.emit(ErrorPacketTypeEnum.NOT_FOUND_ERROR, {
      statusCode: 404,
      error: 'Not Found',
      message: error,
    });
  }
}
