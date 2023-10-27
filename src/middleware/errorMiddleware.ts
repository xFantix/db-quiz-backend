import { NextFunction, Request, Response } from 'express';
import AppError from '../errors/appError';

export const errorMiddleware = (err: AppError, req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    return next(err);
  }

  return res.status(err.status || 500).json({
    error: err.message,
  });
};
