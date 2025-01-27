export class InvalidPasswordError extends Error {
  public constructor(public message: string) {
    super(message);
    this.name = 'InvalidPasswordError';
  }
}
