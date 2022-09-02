import { Router } from 'express';

import { activateCard, blockCard, createNewCard } from '../controllers/cardsController';
import { validateApiKey } from '../middlewares/apiKeyMiddleware';
import { validateBody } from '../middlewares/bodyMiddeware';
import { activateCardSchema, blockUnblockCardSchema, newCardSchema } from '../schemas/cardsSchemas';

export const cardsRouter = Router();

cardsRouter.post('/cards/create', validateApiKey, validateBody(newCardSchema), createNewCard);
cardsRouter.patch('/cards/:cardId/activate', validateBody(activateCardSchema), activateCard);
cardsRouter.patch('/cards/:cardId/block', validateBody(blockUnblockCardSchema), blockCard);
