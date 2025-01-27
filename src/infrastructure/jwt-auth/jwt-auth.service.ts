import { TAuth } from '@core/types/auth.type';
import { TCurrentUser } from '@core/types/current-user.type';

import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { EnvConfigService } from '@infrastructure/env-config/env-config.service';

@Injectable()
export class JwtAuthService {
  public constructor(
    private jwtService: JwtService,
    private configService: EnvConfigService,
  ) {}

  public async generateJwt(currentUser: TCurrentUser): Promise<TAuth> {
    const accessExpiresIn = this.configService.getJwtExpiresAccessInSeconds();
    const refreshExpiresIn = this.configService.getJwtExpiresRefreshInSeconds();

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(currentUser, {
        expiresIn: accessExpiresIn,
      }),
      this.jwtService.signAsync(currentUser, {
        expiresIn: refreshExpiresIn,
      }),
    ]);

    return {
      accessToken,
      refreshToken,
      expiresIn: refreshExpiresIn,
    };
  }

  public async verifyJwt(token: string): Promise<any> {
    return await this.jwtService.verifyAsync(token, {
      secret: this.configService.getJwtSecret(),
    });
  }
}
