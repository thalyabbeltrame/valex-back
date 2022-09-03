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

export async function blockCard(req: Request, res: Response) {
  const { cardId } = req.params;
  const { password } = req.body;

  await cardsService.blockCard(Number(cardId), password);
  res.sendStatus(200);
}

export async function unblockCard(req: Request, res: Response) {
  const { cardId } = req.params;
  const { password } = req.body;

  await cardsService.unblockCard(Number(cardId), password);
  res.sendStatus(200);
}

export async function rechargeCard(req: Request, res: Response) {
  const { apiKey } = res.locals;
  const { cardId } = req.params;
  const { amount } = req.body;

  await cardsService.rechargeCard(apiKey, Number(cardId), Number(amount));
  res.sendStatus(200);
}

export async function payWithCard(req: Request, res: Response) {
  const { cardId } = req.params;
  const { password, businessId, amount } = req.body;

  await cardsService.payWithCard(Number(cardId), password, Number(businessId), Number(amount));
  res.sendStatus(200);
}

export async function getCardBalance(req: Request, res: Response) {
  const { cardId } = req.params;

  const { balance, transactions, recharges } = await cardsService.getCardBalance(Number(cardId));
  res.status(200).json({ balance, transactions, recharges });
}
