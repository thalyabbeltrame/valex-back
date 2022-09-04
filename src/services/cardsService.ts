import dayjs from 'dayjs';

import { Business } from '../interfaces/businessInterface';
import { Card } from '../interfaces/cardInterface';
import { Company } from '../interfaces/companyInterface';
import { Employee } from '../interfaces/employeeInterface';
import * as businessRepository from '../repositories/businessRepository';
import * as cardRepository from '../repositories/cardRepository';
import * as companyRepository from '../repositories/companyRepository';
import * as employeeRepository from '../repositories/employeeRepository';
import * as paymentRepository from '../repositories/paymentRepository';
import * as rechargeRepository from '../repositories/rechargeRepository';
import { TransactionTypes } from '../types/cardTypes';
import { CustomError } from '../utils/CustomError';
import {
  generateCardCVV,
  generateCardNumber,
  generateExpirationDate,
  generateHolderName,
} from '../utils/cardUtils';
import { generateDecryptedData, generateEncryptedData } from '../utils/cryptUtils';

export async function createNewCard(apiKey: string, employeeId: number, type: TransactionTypes) {
  const company = await companyRepository.findByApiKey(apiKey);
  checkIfCompanyExists(company);

  const employee = await employeeRepository.findById(employeeId);
  checkIfEmployeeExists(employee);

  checkIfEmployeeWorksForThisCompany(company, employee);
  await checkIfAlreadyHasCardWithThisType(type, employeeId);

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
  checkIfCardExists(card);
  checkIfCardBelongsToEmployee(card, employeeId);
  checkIfCardIsExpirated(card.expirationDate);
  checkIfCardIsAlreadyActive(card.password);
  checkIfSecurityCodeIsIncorrect(securityCode, card);

  const encryptedPassword = generateEncryptedData(password);
  await cardRepository.update(cardId, { password: encryptedPassword });
}

export async function blockCard(cardId: number, password: string) {
  const card = await cardRepository.findById(cardId);
  checkIfCardExists(card);
  checkIfCardIsExpirated(card.expirationDate);
  checkIfCardIsBlocked(card.isBlocked);
  checkIfPasswordIsIncorrect(password, card);

  await cardRepository.update(cardId, { isBlocked: true });
}

export async function unblockCard(cardId: number, password: string) {
  const card = await cardRepository.findById(cardId);
  checkIfCardExists(card);
  checkIfCardIsExpirated(card.expirationDate);
  checkIfCardIsUnblocked(card.isBlocked);
  checkIfPasswordIsIncorrect(password, card);

  await cardRepository.update(cardId, { isBlocked: false });
}

export async function rechargeCard(apiKey: string, cardId: number, amount: number) {
  const company = await companyRepository.findByApiKey(apiKey);
  checkIfCompanyExists(company);

  const card = await cardRepository.findById(cardId);
  checkIfCardExists(card);

  const employee = await employeeRepository.findById(card.employeeId);
  checkIfEmployeeWorksForThisCompany(company, employee);

  checkIfCardIsInactive(card.password);
  checkIfCardIsExpirated(card.expirationDate);

  await rechargeRepository.insert({ cardId, amount });
}

export async function payWithCard(
  cardId: number,
  password: string,
  businessId: number,
  amount: number
) {
  const card = await cardRepository.findById(cardId);
  checkIfCardExists(card);
  checkIfCardIsInactive(card.password);
  checkIfCardIsExpirated(card.expirationDate);
  checkIfCardIsBlocked(card.isBlocked);
  checkIfPasswordIsIncorrect(password, card);

  const business = await checkIfBusinessIsRegistered(businessId);
  checkIfCardTypeIsAccepted(business, card);

  const { balance } = await calculateCardBalance(cardId);
  await checkIfBalanceIsEnough(balance, amount);

  await paymentRepository.insert({ cardId, amount, businessId });
}

export async function getCardBalance(cardId: number) {
  const card = await cardRepository.findById(cardId);
  checkIfCardExists(card);
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

function checkIfCompanyExists(company: Company | undefined) {
  if (!company) throw new CustomError('not_found', 'Company not found');
  return company;
}

function checkIfEmployeeExists(employee: Employee) {
  if (!employee) throw new CustomError('not_found', 'Employee not found');
  return employee;
}

function checkIfEmployeeWorksForThisCompany(company: Company, employee: Employee) {
  if (company.id !== employee.companyId)
    throw new CustomError('unauthorized', 'Employee does not work for this company');
}

async function checkIfAlreadyHasCardWithThisType(cardType: TransactionTypes, employeeId: number) {
  const cards = await cardRepository.findByTypeAndEmployeeId(cardType, employeeId);
  if (cards) throw new CustomError('conflict', `The employee already has a ${cardType}-type card`);
}

function checkIfCardExists(card: Card) {
  if (!card) throw new CustomError('not_found', 'Card not found');
  return card;
}

function checkIfCardBelongsToEmployee(card: Card, employeeId: number) {
  if (employeeId !== card.employeeId)
    throw new CustomError('forbidden', 'Card does not belong to this employee');
}

function checkIfCardIsExpirated(expirationDate: string) {
  const formattedDate = expirationDate.replace('/', '/01/');
  if (!dayjs().isBefore(dayjs(formattedDate), 'month'))
    throw new CustomError('forbidden', 'This card is expired');
}

function checkIfCardIsAlreadyActive(password: string | undefined) {
  if (password) throw new CustomError('conflict', 'Cannot activate card more than once');
}

function checkIfSecurityCodeIsIncorrect(securityCode: string, card: Card) {
  const decryptedCode = generateDecryptedData(card.securityCode);
  if (securityCode !== decryptedCode) {
    throw new CustomError('unauthorized', 'Invalid security code');
  }
}

function checkIfCardIsBlocked(isBlocked: boolean) {
  if (isBlocked) throw new CustomError('conflict', 'Card is blocked');
}

function checkIfPasswordIsIncorrect(password: string, card: Card) {
  const decryptedPassword = card.password ? generateDecryptedData(card.password) : '';
  if (password !== decryptedPassword) throw new CustomError('unauthorized', 'Invalid password');
}

function checkIfCardIsUnblocked(isBlocked: boolean) {
  if (!isBlocked) throw new CustomError('conflict', 'Card is unblocked');
}

function checkIfCardIsInactive(password: string | undefined) {
  if (!password) throw new CustomError('unauthorized', 'Card is inactive');
}

async function checkIfBusinessIsRegistered(businessId: number) {
  const business = await businessRepository.findById(businessId);
  if (!business) throw new CustomError('not_found', 'Business not found');
  return business;
}

function checkIfCardTypeIsAccepted(business: Business, card: Card) {
  if (business.type !== card.type)
    throw new CustomError('unauthorized', 'The business does not accept this card type');
}

async function checkIfBalanceIsEnough(balance: number, amount: number) {
  if (amount > balance) throw new CustomError('bad_request', 'Insufficient balance');
}

async function calculateCardBalance(cardId: number) {
  const transactions = await paymentRepository.findByCardId(cardId);
  const recharges = await rechargeRepository.findByCardId(cardId);
  const balance =
    recharges.reduce((prev, curr) => prev + curr.amount, 0) -
    transactions.reduce((prev, curr) => prev + curr.amount, 0);
  return { balance, transactions, recharges };
}
