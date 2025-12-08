import { AppError } from "./AppError";

export class BadRequestError extends AppError {
    details: any;
  constructor(message = "Bad Request", details?: any) {
    super(message);
    this.status = 400;
    this.details = details || null;
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden") {
    super(message, 403);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Not Found") {
    super(message, 404);
  }
}

export class ConflictError extends AppError {
  constructor(message = "Conflict") {
    super(message, 409);
  }
}

export class NetworkError extends AppError {
  constructor(message = "Network Error") {
    super(message, 503); 
  }
}


export class DatabaseConnectionError extends AppError {
  constructor(message = "Failed to connect to the database") {
    super(message, 500); 
  }
}
