import { Router } from 'express';

import { createNewVirtualCard, deleteVirtualCard } from '../controllers/virtualCardsController';
import { validateBody } from '../middlewares/bodyMiddeware';
import { validateParams } from '../middlewares/paramsMiddleware';
import { deleteVirtualCardSchema, newVirtualCardSchema } from '../schemas/virtualCardsSchemas';

export const virtualCardsRouter = Router();

virtualCardsRouter.post(
  '/virtual-cards/:cardId/create',
  validateParams,
  validateBody(newVirtualCardSchema),
  createNewVirtualCard
);
virtualCardsRouter.delete(
  '/virtual-cards/:cardId/delete',
  validateParams,
  validateBody(deleteVirtualCardSchema),
  deleteVirtualCard
);
