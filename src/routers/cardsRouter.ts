import { Router } from 'express';

import { activateCard, createNewCard } from '../controllers/cardsController';
import { validateApiKey } from '../middlewares/apiKeyMiddleware';
import { validateBody } from '../middlewares/bodyMiddeware';
import { activateCardSchema, newCardSchema } from '../schemas/cardsSchemas';

export const cardsRouter = Router();

cardsRouter.post('/cards/create', validateApiKey, validateBody(newCardSchema), createNewCard);
cardsRouter.patch('/cards/:cardId/activate', validateBody(activateCardSchema), activateCard);
