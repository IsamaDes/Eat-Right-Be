"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const logger_1 = require("../utils/logger");
const AppError_1 = require("../errors/AppError");
const errorHandler = (err, req, res, next) => {
    const isOperational = err instanceof AppError_1.AppError;
    logger_1.logger.error({
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
exports.errorHandler = errorHandler;
