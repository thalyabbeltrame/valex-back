import { NextFunction, Request, Response } from 'express';

import { CustomError } from '../utils/CustomError';

export function validateParams(req: Request, res: Response, next: NextFunction) {
  const { cardId } = req.params;

  if (!cardId || isNaN(Number(cardId)) || Number(cardId) % 1 !== 0) {
    throw new CustomError('unprocessable_entity', 'CardId must be a positive integer');
  }

  res.locals.cardId = parseInt(cardId);
  return next();
}
