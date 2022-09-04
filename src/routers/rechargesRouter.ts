import { Router } from 'express';

import { rechargeCard } from '../controllers/rechargesController';
import { validateApiKey } from '../middlewares/apiKeyMiddleware';
import { validateBody } from '../middlewares/bodyMiddeware';
import { validateParams } from '../middlewares/paramsMiddleware';
import { rechargeCardSchema } from '../schemas/rechargesSchemas';

export const rechargesRouter = Router();

rechargesRouter.post(
  '/cards/:cardId/recharge',
  validateApiKey,
  validateParams,
  validateBody(rechargeCardSchema),
  rechargeCard
);
