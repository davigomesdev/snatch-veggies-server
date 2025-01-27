export class NotFoundError extends Error {
  public constructor(public message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}
