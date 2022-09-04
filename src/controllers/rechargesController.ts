import { Request, Response } from 'express';

import * as rechargesService from '../services/rechargesService';

export async function rechargeCard(req: Request, res: Response) {
  const { apiKey, cardId } = res.locals;
  const { amount } = req.body;

  await rechargesService.rechargeCard(apiKey, cardId, parseInt(amount));
  res.sendStatus(200);
}
