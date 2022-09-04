import { Router } from 'express';

import { createNewVirtualCard } from '../controllers/virtualCardsController';
import { validateBody } from '../middlewares/bodyMiddeware';
import { validateParams } from '../middlewares/paramsMiddleware';
import { newVirtualCardSchema } from '../schemas/virtualCardsSchemas';

export const virtualCardsRouter = Router();

virtualCardsRouter.post(
  '/virtual-cards/:cardId/create',
  validateParams,
  validateBody(newVirtualCardSchema),
  createNewVirtualCard
);
