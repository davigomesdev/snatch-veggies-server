export class ConflictError extends Error {
  public constructor(public message: string) {
    super(message);
    this.name = 'ConflictError';
  }
}
