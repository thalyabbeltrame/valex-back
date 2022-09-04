import { Router } from 'express';

import { payWithCard, payOnlinePurchase } from '../controllers/paymentsController';
import { validateBody } from '../middlewares/bodyMiddeware';
import { validateParams } from '../middlewares/paramsMiddleware';
import { posPaymentSchema, onlinePaymentSchema } from '../schemas/paymentsSchemas';

export const paymentsRouter = Router();

paymentsRouter.post(
  '/cards/:cardId/payment/pos',
  validateParams,
  validateBody(posPaymentSchema),
  payWithCard
);
paymentsRouter.post('/cards/payment/online', validateBody(onlinePaymentSchema), payOnlinePurchase);
