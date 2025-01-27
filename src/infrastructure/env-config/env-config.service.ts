import { Injectable } from '@nestjs/common';
import { IEnvConfig } from './env-config.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EnvConfigService implements IEnvConfig {
  public constructor(private configService: ConfigService) {}

  public getAppPort(): number {
    return Number(this.configService.get<number>('PORT'));
  }

  public getNodeEnv(): string {
    return this.configService.get<string>('NODE_ENV');
  }

  public getMongoDBUri(): string {
    return this.configService.get<string>('MONGODB_URI');
  }

  public getMatchRpcUrl(): string {
    return this.configService.get<string>('MATCH_RPC_URL');
  }

  public getJwtSecret(): string {
    return this.configService.get<string>('JWT_SECRET');
  }

  public getSnatchVeggiesContract(): string {
    return this.configService.get<string>('SNATCH_VEGGIES_CONTRACT');
  }

  public getSnatchVeggiesBankContract(): string {
    return this.configService.get<string>('SNATCH_VEGGIES_BANK_CONTRACT');
  }

  public getSnatchVeggiesLandContract(): string {
    return this.configService.get<string>('SNATCH_VEGGIES_LAND_CONTRACT');
  }

  public getMessengerAddress(): string {
    return this.configService.get<string>('MESSENGER_ADDRESS');
  }

  public getMessengerPrivateKey(): string {
    return this.configService.get<string>('MESSENGER_PRIVATE_KEY');
  }

  public getJwtExpiresAccessInSeconds(): number {
    return Number(this.configService.get<number>('JWT_EXPIRES_ACCESS_IN'));
  }

  public getJwtExpiresRefreshInSeconds(): number {
    return Number(this.configService.get<number>('JWT_EXPIRES_REFRESH_IN'));
  }
}
