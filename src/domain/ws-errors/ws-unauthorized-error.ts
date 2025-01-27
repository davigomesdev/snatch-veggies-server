import { WsException } from '@nestjs/websockets';

export class WsUnauthorizedError extends WsException {
  public constructor(public message: string) {
    super(message);
    this.name = 'WsUnauthorizedError';
  }
}
