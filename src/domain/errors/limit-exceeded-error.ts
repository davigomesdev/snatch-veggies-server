export class LimitExceededError extends Error {
  public constructor(public message: string) {
    super(message);
    this.name = 'LimitExceededError';
  }
}
