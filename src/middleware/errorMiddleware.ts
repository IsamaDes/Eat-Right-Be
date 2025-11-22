import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";
import { AppError } from "../errors/AppError";

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  const isOperational = err instanceof AppError;

  logger.error({
    message: err.message,
    stack: err.stack,
    path: req.url,
    details: err.details ?? null,
  }, "Error occurred");

  const status = isOperational ? err.status : 500;

  res.status(status).json({
    success: false,
    errorType: err.constructor?.name || "UnknownError",
    message: err.message || "Internal Server Error",
  });
};
