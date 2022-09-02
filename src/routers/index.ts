import { Router } from 'express';

import { cardsRouter } from './cardsRouter';

export const router = Router();

router.use(cardsRouter);
