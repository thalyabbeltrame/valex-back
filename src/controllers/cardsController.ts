import { Request, Response } from 'express';

import * as cardsService from '../services/cardsService';

export async function createNewCard(req: Request, res: Response) {
  const { apiKey } = res.locals;
  const { employeeId, type } = req.body;

  await cardsService.createNewCard(apiKey, employeeId, type);
  res.sendStatus(201);
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

export async function rechargeCard(req: Request, res: Response) {
  const { apiKey, cardId } = res.locals;
  const { amount } = req.body;

  await cardsService.rechargeCard(apiKey, cardId, parseInt(amount));
  res.sendStatus(200);
}

export async function payWithCard(req: Request, res: Response) {
  const { cardId } = res.locals;
  const { password, businessId, amount } = req.body;

  await cardsService.payWithCard(cardId, password, parseInt(businessId), parseInt(amount));
  res.sendStatus(200);
}

export async function getCardBalance(req: Request, res: Response) {
  const { cardId } = res.locals;

  const { balance, transactions, recharges } = await cardsService.getCardBalance(cardId);
  res.status(200).json({ balance, transactions, recharges });
}
