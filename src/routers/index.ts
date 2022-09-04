import { Router } from 'express';

import { cardsRouter } from './cardsRouter';
import { paymentsRouter } from './paymentsRouter';
import { rechargesRouter } from './rechargesRouter';

export const router = Router();

router.use(cardsRouter);
router.use(rechargesRouter);
router.use(paymentsRouter);
