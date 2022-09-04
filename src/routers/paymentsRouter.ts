import { Router } from 'express';

import { payWithCard } from '../controllers/paymentsController';
import { validateBody } from '../middlewares/bodyMiddeware';
import { validateParams } from '../middlewares/paramsMiddleware';
import { paymentPosSchema } from '../schemas/cardsSchemas';

export const paymentsRouter = Router();

paymentsRouter.post(
  '/cards/:cardId/payment/pos',
  validateParams,
  validateBody(paymentPosSchema),
  payWithCard
);
