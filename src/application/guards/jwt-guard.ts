import { AccessLevelEnum } from '@core/enums/access-level.enum';

import { ROLES_KEY } from '@core/decorators/roles.decorator';

import { Reflector } from '@nestjs/core';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';

import { JwtAuthService } from '@infrastructure/jwt-auth/jwt-auth.service';

@Injectable()
export class JwtGuard implements CanActivate {
  public constructor(
    private readonly jwtAuthService: JwtAuthService,
    private readonly reflector: Reflector,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const decodedToken = await this.jwtAuthService.verifyJwt(token);

      request['user'] = decodedToken;

      const requiredRoles = this.reflector.getAllAndOverride<AccessLevelEnum[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);

      if (requiredRoles) {
        const hasRole = requiredRoles.includes(decodedToken.accessLevel);
        if (!hasRole) {
          throw new ForbiddenException('Access denied.');
        }
      }
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
