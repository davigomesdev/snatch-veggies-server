import { Module } from '@nestjs/common';

import { LandModule } from '@modules/land/adapters/land.module';
import { JwtAuthModule } from '@infrastructure/jwt-auth/jwt-auth.module';

import { WebSocketServerGateway } from './websocket-server.gateway';

@Module({
  imports: [JwtAuthModule, LandModule],
  providers: [WebSocketServerGateway],
})
export class WebSocketServerModule {}
