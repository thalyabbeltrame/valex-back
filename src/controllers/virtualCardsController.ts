import { Request, Response } from 'express';

import * as virtualCardsService from '../services/virtualCardsService';

export async function createNewVirtualCard(req: Request, res: Response) {
  const { cardId } = res.locals;
  const { password } = req.body;

  await virtualCardsService.createNewVirtualCard(cardId, password);
  res.sendStatus(201);
}

export async function deleteVirtualCard(req: Request, res: Response) {
  const { cardId } = res.locals;
  const { password } = req.body;

  await virtualCardsService.deleteVirtualCard(cardId, password);
  res.sendStatus(200);
}
