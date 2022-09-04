import * as cardRepository from '../repositories/cardRepository';
import * as companyRepository from '../repositories/companyRepository';
import * as employeeRepository from '../repositories/employeeRepository';
import * as paymentRepository from '../repositories/paymentRepository';
import * as rechargeRepository from '../repositories/rechargeRepository';
import { TransactionTypes } from '../types/cardTypes';
import {
  generateCardCVV,
  generateCardNumber,
  generateExpirationDate,
  generateHolderName,
} from '../utils/cardUtils';
import { generateEncryptedData } from '../utils/cryptUtils';
import * as validationService from './validationService';

export async function createNewCard(apiKey: string, employeeId: number, type: TransactionTypes) {
  const company = await companyRepository.findByApiKey(apiKey);
  validationService.checkIfCompanyExists(company);

  const employee = await employeeRepository.findById(employeeId);
  validationService.checkIfEmployeeExists(employee);

  validationService.checkIfEmployeeWorksForThisCompany(company, employee);
  await validationService.checkIfAlreadyHasCardWithThisType(type, employeeId);

  const cardData = createCardData(employeeId, employee.fullName, type);
  await cardRepository.insert(cardData);
}

export async function activateCard(
  cardId: number,
  employeeId: number,
  password: string,
  securityCode: string
) {
  const card = await cardRepository.findById(cardId);
  validationService.checkIfCardExists(card);
  validationService.checkIfCardBelongsToEmployee(card, employeeId);
  validationService.checkIfCardIsExpirated(card.expirationDate);
  validationService.checkIfCardIsAlreadyActive(card.password);
  validationService.checkIfSecurityCodeIsIncorrect(securityCode, card);

  const encryptedPassword = generateEncryptedData(password);
  await cardRepository.update(cardId, { password: encryptedPassword });
}

export async function blockCard(cardId: number, password: string) {
  const card = await cardRepository.findById(cardId);
  validationService.checkIfCardExists(card);
  validationService.checkIfCardIsExpirated(card.expirationDate);
  validationService.checkIfCardIsBlocked(card.isBlocked);
  validationService.checkIfPasswordIsIncorrect(password, card);

  await cardRepository.update(cardId, { isBlocked: true });
}

export async function unblockCard(cardId: number, password: string) {
  const card = await cardRepository.findById(cardId);
  validationService.checkIfCardExists(card);
  validationService.checkIfCardIsExpirated(card.expirationDate);
  validationService.checkIfCardIsUnblocked(card.isBlocked);
  validationService.checkIfPasswordIsIncorrect(password, card);

  await cardRepository.update(cardId, { isBlocked: false });
}

export async function getCardBalance(cardId: number) {
  const card = await cardRepository.findById(cardId);
  validationService.checkIfCardExists(card);

  const { balance, transactions, recharges } = await calculateCardBalance(cardId);
  return { balance, transactions, recharges };
}

function createCardData(employeeId: number, employeeFullName: string, type: TransactionTypes) {
  return {
    employeeId: employeeId,
    number: generateCardNumber(),
    cardholderName: generateHolderName(employeeFullName),
    securityCode: generateEncryptedData(generateCardCVV()),
    expirationDate: generateExpirationDate(),
    password: undefined,
    isVirtual: false,
    originalCardId: undefined,
    isBlocked: false,
    type: type,
  };
}

export async function calculateCardBalance(cardId: number) {
  const transactions = await paymentRepository.findByCardId(cardId);
  const recharges = await rechargeRepository.findByCardId(cardId);
  const balance =
    recharges.reduce((prev, curr) => prev + curr.amount, 0) -
    transactions.reduce((prev, curr) => prev + curr.amount, 0);
  return { balance, transactions, recharges };
}
