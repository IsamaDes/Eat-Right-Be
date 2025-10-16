import type { Request, Response, NextFunction } from "express";

/**
 * Middleware for handling 404 Not Found errors
 */
const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * Middleware for handling invalid credentials (401)
 */
const invalidCredentials = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error("Invalid Credentials");
  res.status(401);
  next(error);
};

/**
 * Middleware for handling bad request (400)
 */
const badRequest = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error("Bad Request");
  res.status(400);
  next(error);
};

/**
 * Global error handler middleware
 */
const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message || "Something went wrong",
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};


export { notFound, invalidCredentials, badRequest, errorHandler };