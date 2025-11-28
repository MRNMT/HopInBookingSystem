import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../common/types/types';

/**
 * Custom Error Class to handle operational errors (e.g., 404 Not Found, 400 Bad Request)
 * This class is used throughout the application (in Services and Controllers) 
 * to throw errors with a specific HTTP status code.
 */
export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    // Capture stack trace (exclude constructor call)
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Global Error Handling Middleware
 * This catches all errors (AppError, ZodError, or generic server crashes)
 * and formats the final response for the client.
 */
export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // 1. Determine Status Code and Message
  // Check if it's a known operational error (instance of AppError)
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // 2. Log Error Details
  console.error(`❌ [${req.method}] ${req.path} >> Status: ${statusCode}, Message: ${message}`);
  if (statusCode >= 500) { // Only log stack trace for Server Errors
    console.error(err.stack);
  }

  // 3. Format Response for the Client
  const response: ApiResponse<null> = {
    message: message, // Return the ACTUAL error message
    error: message,

    // Include stack trace only in the 'development' environment
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack
    } as any),
  };

  // 4. Send the response
  res.status(statusCode).json(response);
};