import { Router } from 'express';

import { validateApiKey } from '../middlewares/apiKeyMiddleware';
import { validateBody } from '../middlewares/bodyMiddeware';
import { validateParams } from '../middlewares/paramsMiddleware';
import { rechargeCardSchema } from '../schemas/cardsSchemas';
import { rechargeCard } from '../controllers/rechargesController';

export const rechargesRouter = Router();

rechargesRouter.post(
  '/cards/:cardId/recharge',
  validateApiKey,
  validateParams,
  validateBody(rechargeCardSchema),
  rechargeCard
);
