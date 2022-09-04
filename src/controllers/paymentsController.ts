import { Request, Response } from 'express';

import * as paymentsService from '../services/paymentsService';

export async function payWithCard(req: Request, res: Response) {
  const { cardId } = res.locals;
  const { password, businessId, amount } = req.body;

  await paymentsService.payWithCard(cardId, password, parseInt(businessId), parseInt(amount));
  res.sendStatus(200);
}
