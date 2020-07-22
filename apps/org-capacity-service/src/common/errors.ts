export class UnauthorizedError extends Error {
  constructor(message?: string) {
    super(message);

    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}

export class InvalidOperationError extends Error {
  constructor(message?: string) {
    super(message);

    Object.setPrototypeOf(this, InvalidOperationError.prototype);
  }
}
