import { Request, Response, NextFunction, RequestHandler } from 'express';
import Joi from 'joi';
import BadRequest from '../errors/badRequestError';

interface HandlerOptions {
  validation?: {
    body?: Joi.ObjectSchema;
    query?: Joi.ObjectSchema;
  };
}

const getMessageFromJoiError = (error: Joi.ValidationError): string | undefined => {
  if (!error.details && error.message) {
    return error.message;
  }
  return error.details && error.details.length > 0 && error.details[0].message
    ? `PATH: [${error.details[0].path}] ;; MESSAGE: ${error.details[0].message}`
    : undefined;
};

export const requestMiddleware =
  (handler: RequestHandler, options?: HandlerOptions): RequestHandler =>
  async (req: Request, res: Response, next: NextFunction) => {
    if (options?.validation?.body) {
      const { error } = options?.validation?.body.validate(req.body);
      if (error != null) {
        next(new BadRequest(getMessageFromJoiError(error)));
        return;
      }
    }

    if (options?.validation?.query) {
      const { error } = options?.validation?.query.validate(req.params);
      if (error != null) {
        next(new BadRequest(getMessageFromJoiError(error)));
        return;
      }
    }

    try {
      handler(req, res, next);
    } catch (err) {
      next(err);
    }
  };
