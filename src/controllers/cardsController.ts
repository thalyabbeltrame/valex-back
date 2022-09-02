import { Request, Response } from 'express';

import * as cardsService from '../services/cardsService';

export async function createNewCard(req: Request, res: Response) {
  const { apiKey } = res.locals;
  const { employeeId, type } = req.body;

  await cardsService.createNewCard(apiKey, employeeId, type);
  res.sendStatus(201);
}

export async function activateCard(req: Request, res: Response) {
  const { cardId } = req.params;
  const { employeeId, password, securityCode } = req.body;

  await cardsService.activateCard(Number(cardId), Number(employeeId), password, securityCode);
  res.sendStatus(200);
}
