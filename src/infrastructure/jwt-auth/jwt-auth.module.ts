import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { EnvConfigModule } from '@infrastructure/env-config/env-config.module';
import { EnvConfigService } from '@infrastructure/env-config/env-config.service';

import { JwtAuthService } from './jwt-auth.service';

@Module({
  imports: [
    EnvConfigModule,
    JwtModule.registerAsync({
      imports: [EnvConfigModule],
      useFactory: async (configService: EnvConfigService) => ({
        global: true,
        secret: configService.getJwtSecret(),
        signOptions: {
          expiresIn: configService.getJwtExpiresAccessInSeconds(),
        },
      }),
      inject: [EnvConfigService],
    }),
  ],
  providers: [JwtAuthService],
  exports: [JwtAuthService],
})
export class JwtAuthModule {}
