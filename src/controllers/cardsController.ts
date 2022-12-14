import { Request, Response } from 'express';

import * as cardsService from '../services/cardsService';

export async function createNewCard(req: Request, res: Response) {
  const { apiKey } = res.locals;
  const { employeeId, type } = req.body;

  const card = await cardsService.createNewCard(apiKey, employeeId, type);
  res.status(201).send(card);
}

export async function activateCard(req: Request, res: Response) {
  const { cardId } = res.locals;
  const { employeeId, password, securityCode } = req.body;

  await cardsService.activateCard(cardId, employeeId, password, securityCode);
  res.sendStatus(200);
}

export async function blockCard(req: Request, res: Response) {
  const { cardId } = res.locals;
  const { password } = req.body;

  await cardsService.blockCard(cardId, password);
  res.sendStatus(200);
}

export async function unblockCard(req: Request, res: Response) {
  const { cardId } = res.locals;
  const { password } = req.body;

  await cardsService.unblockCard(cardId, password);
  res.sendStatus(200);
}

export async function getCardBalance(req: Request, res: Response) {
  const { cardId } = res.locals;

  const { balance, transactions, recharges } = await cardsService.getCardBalance(cardId);
  res.status(200).json({ balance, transactions, recharges });
}
