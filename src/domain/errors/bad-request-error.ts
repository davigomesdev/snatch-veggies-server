export class BadRequestError extends Error {
  public constructor(public message: string) {
    super(message);
    this.name = 'BadRequestError';
  }
}
