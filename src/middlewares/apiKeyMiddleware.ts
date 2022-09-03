import { NextFunction, Request, Response } from 'express';

import { CustomError } from '../utils/CustomError';

export function validateApiKey(req: Request, res: Response, next: NextFunction) {
  const { 'x-api-key': apiKey } = req.headers;
  if (!apiKey || typeof apiKey !== 'string' || apiKey.trim().length === 0) {
    throw new CustomError('unauthorized', 'Header x-api-key is missing');
  }

  res.locals.apiKey = apiKey.trim();
  return next();
}
