import * as cardRepository from '../repositories/cardRepository';
import * as paymentRepository from '../repositories/paymentRepository';
import * as cardsService from './cardsService';
import * as validationService from './validationService';

interface CardData {
  number: string;
  cardholderName: string;
  expirationDate: string;
  securityCode: string;
}

export async function payWithCard(
  cardId: number,
  password: string,
  businessId: number,
  amount: number
) {
  const card = await cardRepository.findById(cardId);
  validationService.checkIfCardExists(card);
  validationService.checkIfCardIsInactive(card.password);
  validationService.checkIfCardIsExpirated(card.expirationDate);
  validationService.checkIfCardIsBlocked(card.isBlocked);
  validationService.checkIfPasswordIsIncorrect(password, card);

  const business = await validationService.checkIfBusinessIsRegistered(businessId);
  validationService.checkIfCardTypeIsAccepted(business, card);

  const { balance } = await cardsService.calculateCardBalance(cardId);
  await validationService.checkIfBalanceIsEnough(balance, amount);

  await paymentRepository.insert({ cardId, amount, businessId });
}

export async function payOnlinePurchase(cardData: CardData, businessId: number, amount: number) {
  const card = await cardRepository.findByCardDetails(
    cardData.number,
    cardData.cardholderName,
    cardData.expirationDate
  );
  validationService.checkIfCardExists(card);
  validationService.checkIfSecurityCodeIsIncorrect(cardData.securityCode, card);
  validationService.checkIfCardIsInactive(card.password);
  validationService.checkIfCardIsExpirated(card.expirationDate);
  validationService.checkIfCardIsBlocked(card.isBlocked);

  const business = await validationService.checkIfBusinessIsRegistered(businessId);
  validationService.checkIfCardTypeIsAccepted(business, card);

  const { balance } = await cardsService.calculateCardBalance(card.id);
  await validationService.checkIfBalanceIsEnough(balance, amount);

  await paymentRepository.insert({ cardId: card.id, amount, businessId });
}
