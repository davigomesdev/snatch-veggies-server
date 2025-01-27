import { ErrorPacketTypeEnum } from '@core/enums/packets-type.enum';
import { WsBadRequestError } from '@domain/ws-errors/ws-bad-request-error';
import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';

@Catch(WsBadRequestError)
export class WsBadRequestErrorFilter implements ExceptionFilter {
  public catch(exception: WsBadRequestError, host: ArgumentsHost): any {
    const client = host.switchToWs().getClient();
    const error = exception.getError();

    client.emit(ErrorPacketTypeEnum.BAD_REQUEST_ERROR, {
      statusCode: 400,
      error: 'Bad Request',
      message: error,
    });
  }
}
