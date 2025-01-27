export class InvalidCredentialsError extends Error {
  public constructor(public message: string) {
    super(message);
    this.name = 'InvalidCredentialsError';
  }
}
