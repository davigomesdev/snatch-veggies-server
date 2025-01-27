import { WsException } from '@nestjs/websockets';

export class WsNotFoundError extends WsException {
  public constructor(public message: string) {
    super(message);
    this.name = 'WsNotFoundError';
  }
}
