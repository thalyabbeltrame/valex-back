import { Card } from '../interfaces/cardInterface';
import * as cardRepository from '../repositories/cardRepository';
import { CardInsertData } from '../types/cardTypes';
import { generateCardCVV, generateCardNumber, generateExpirationDate } from '../utils/cardUtils';
import { generateEncryptedData } from '../utils/cryptUtils';
import * as validationService from './validationService';

export async function createNewVirtualCard(cardId: number, password: string) {
  const card = await cardRepository.findById(cardId);
  validationService.checkIfCardExists(card);
  validationService.checkIfCardIsInactive(card.password);
  validationService.checkIfCardIsVirtual(card.isVirtual);
  validationService.checkIfPasswordIsIncorrect(password, card);

  const virtualCardData = createVirtualCardData(card);
  await cardRepository.insert(virtualCardData);
}

export async function deleteVirtualCard(cardId: number, password: string) {
  const card = await cardRepository.findById(cardId);
  validationService.checkIfCardExists(card);
  validationService.checkIfCardIsNotVirtual(card.isVirtual);
  validationService.checkIfPasswordIsIncorrect(password, card);

  await cardRepository.remove(cardId);
}

function createVirtualCardData(card: Card): CardInsertData {
  return {
    employeeId: card.employeeId,
    number: generateCardNumber('mastercard'),
    cardholderName: card.cardholderName,
    securityCode: generateEncryptedData(generateCardCVV()),
    expirationDate: generateExpirationDate(),
    password: card.password,
    isVirtual: true,
    originalCardId: card.id,
    isBlocked: false,
    type: card.type,
  };
}
