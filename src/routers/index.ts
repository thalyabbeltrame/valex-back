import { Router } from 'express';

import { cardsRouter } from './cardsRouter';
import { paymentsRouter } from './paymentsRouter';
import { rechargesRouter } from './rechargesRouter';
import { virtualCardsRouter } from './virtualCardsRouter';

export const router = Router();

router.use(cardsRouter);
router.use(rechargesRouter);
router.use(paymentsRouter);
router.use(virtualCardsRouter);
