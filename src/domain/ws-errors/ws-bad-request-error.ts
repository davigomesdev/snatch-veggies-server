import { WsException } from '@nestjs/websockets';

export class WsBadRequestError extends WsException {
  public constructor(public message: string) {
    super(message);
    this.name = 'WsBadRequestError';
  }
}
