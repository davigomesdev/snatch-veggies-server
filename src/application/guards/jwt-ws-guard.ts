import { WsUnauthorizedError } from '@domain/ws-errors/ws-unauthorized-error';
import { JwtAuthService } from '@infrastructure/jwt-auth/jwt-auth.service';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class JwtWsGuard implements CanActivate {
  public constructor(private readonly jwtAuthService: JwtAuthService) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient();
    const token = this.extractTokenFromHeader(client);

    if (!token) {
      throw new WsUnauthorizedError('No token provided.');
    }

    try {
      client.user = await this.jwtAuthService.verifyJwt(token);
      return true;
    } catch {
      throw new WsUnauthorizedError('Invalid token.');
    }
  }

  private extractTokenFromHeader(client: any): string | undefined {
    return client.handshake.auth.token;
  }
}
