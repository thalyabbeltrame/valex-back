import { NextFunction, Request, Response } from 'express';
import { Schema } from 'joi';

import { CustomError } from '../utils/CustomError';

export function validateBody(schema: Schema) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      throw new CustomError(
        'unprocessable_entity',
        error.details.map(({ message }) => message).join(', ')
      );
    }

    next();
  };
}
