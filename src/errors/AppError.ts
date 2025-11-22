export class AppError extends Error {
  status: number;
  isOperational: boolean;

  constructor(message: string, status: number = 500, isOperational = true) {
    super(message);
    this.status = status;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}
