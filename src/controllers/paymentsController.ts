import { Request, Response } from 'express';

import * as paymentsService from '../services/paymentsService';

export async function payWithCard(req: Request, res: Response) {
  const { cardId } = res.locals;
  const { password, businessId, amount } = req.body;

  await paymentsService.payWithCard(cardId, password, parseInt(businessId), parseInt(amount));
  res.sendStatus(200);
}

export async function payOnlinePurchase(req: Request, res: Response) {
  const { cardData, businessId, amount } = req.body;

  await paymentsService.payOnlinePurchase(cardData, parseInt(businessId), parseInt(amount));
  res.sendStatus(200);
}
