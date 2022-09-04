import { Router } from 'express';

import {
  activateCard,
  blockCard,
  createNewCard,
  getCardBalance,
  payWithCard,
  rechargeCard,
  unblockCard,
} from '../controllers/cardsController';
import { validateApiKey } from '../middlewares/apiKeyMiddleware';
import { validateBody } from '../middlewares/bodyMiddeware';
import { validateParams } from '../middlewares/paramsMiddleware';
import {
  activateCardSchema,
  blockUnblockCardSchema,
  newCardSchema,
  paymentSchema,
  rechargeCardSchema,
} from '../schemas/cardsSchemas';

export const cardsRouter = Router();

cardsRouter.post('/cards/create', validateApiKey, validateBody(newCardSchema), createNewCard);
cardsRouter.patch(
  '/cards/:cardId/activate',
  validateParams,
  validateBody(activateCardSchema),
  activateCard
);
cardsRouter.patch(
  '/cards/:cardId/block',
  validateParams,
  validateBody(blockUnblockCardSchema),
  blockCard
);
cardsRouter.patch('/cards/:cardId/unblock', validateBody(blockUnblockCardSchema), unblockCard);
cardsRouter.post(
  '/cards/:cardId/recharge',
  validateApiKey,
  validateBody(rechargeCardSchema),
  rechargeCard
);
cardsRouter.post('/cards/:cardId/payment', validateBody(paymentSchema), payWithCard);
cardsRouter.get('/cards/:cardId/balance', getCardBalance);
