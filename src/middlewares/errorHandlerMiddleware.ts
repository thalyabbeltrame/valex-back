import { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/classes/AppError';

interface StatusCodeObject {
  [typeofError: string]: number;
}

type Error = {
  status: string;
  message: string;
};

export function erroHandler(error: Error, _req: Request, res: Response, _next: NextFunction) {
  const httpStatusCode: StatusCodeObject = {
    bad_request: 400,
    unauthorized: 401,
    forbidden: 403,
    not_found: 404,
    conflict: 409,
    unprocessable_entity: 422,
  };

  if (error instanceof AppError) {
    return res.status(httpStatusCode[error.status]).send({ message: error.message });
  }

  return res.status(500).send(error);
}
