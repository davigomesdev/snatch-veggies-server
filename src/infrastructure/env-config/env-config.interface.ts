export interface IEnvConfig {
  getAppPort(): number;
  getNodeEnv(): string;
  getMongoDBUri(): string;
  getMatchRpcUrl(): string;
  getSnatchVeggiesContract(): string;
  getSnatchVeggiesBankContract(): string;
  getSnatchVeggiesLandContract(): string;
  getMessengerAddress(): string;
  getMessengerPrivateKey(): string;
  getJwtSecret(): string;
  getJwtExpiresAccessInSeconds(): number;
  getJwtExpiresRefreshInSeconds(): number;
}
