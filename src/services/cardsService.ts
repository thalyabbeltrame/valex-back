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
  const company = await checkIfCompanyExists(apiKey);
  const employee = await checkIfEmployeeExists(employeeId);
  checkIfEmployeeWorksAtTheCompany(company, employee);
  await checkIfHasCardWithThisType(type, employeeId);
  const cardData = createCardData(employeeId, employee.fullName, type);
  await cardRepository.insert(cardData);
}

export async function activateCard(
  cardId: number,
  employeeId: number,
  password: string,
  securityCode: string
) {
  const card = await checkIfCardExists(cardId);
  checkIfCardBelongsToEmployee(employeeId, card);
  checkIfCardIsExpirated(card);
  checkIfCardIsActive(card);
  checkIfSecurityCodeIsCorrect(securityCode, card);

  const encryptedPassword = generateEncryptedData(password);
  await cardRepository.update(cardId, { password: encryptedPassword });
}

export async function blockCard(cardId: number, password: string) {
  const card = await checkIfCardExists(cardId);
  checkIfCardIsExpirated(card);
  checkIfCardIsBlocked(card);
  checkIfPasswordIsCorrect(password, card);

  await cardRepository.update(cardId, { isBlocked: true });
}

export async function unblockCard(cardId: number, password: string) {
  const card = await checkIfCardExists(cardId);
  checkIfCardIsExpirated(card);
  checkIfCardIsUnblocked(card);
  checkIfPasswordIsCorrect(password, card);

  await cardRepository.update(cardId, { isBlocked: false });
}

export async function rechargeCard(apiKey: string, cardId: number, amount: number) {
  const company = await checkIfCompanyExists(apiKey);
  const card = await checkIfCardExists(cardId);
  const employee = await employeeRepository.findById(card.employeeId);
  checkIfEmployeeWorksAtTheCompany(company, employee);
  checkIfCardIsInactive(card);
  checkIfCardIsExpirated(card);

  await rechargeRepository.insert({ cardId, amount });
}

export async function payWithCard(
  cardId: number,
  password: string,
  businessId: number,
  amount: number
) {
  const card = await checkIfCardExists(cardId);
  checkIfCardIsInactive(card);
  checkIfCardIsExpirated(card);
  checkIfCardIsBlocked(card);
  checkIfPasswordIsCorrect(password, card);

  const business = await checkIfBusinessIsRegistered(businessId);
  checkIfCardTypeIsAcceptedAtBusiness(business, card);

  const { balance } = await calculateCardBalance(cardId);
  await checkIfBalanceIsEnough(balance, amount);
}

export async function getCardBalance(cardId: number) {
  await checkIfCardExists(cardId);
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

async function checkIfCompanyExists(apiKey: string) {
  const company = await companyRepository.findByApiKey(apiKey);
  if (!company) throw new CustomError('not_found', 'Company not found');
  return company;
}

async function checkIfEmployeeExists(employeeId: number) {
  const employee = await employeeRepository.findById(employeeId);
  if (!employee) throw new CustomError('not_found', 'Employee not found');
  return employee;
}

function checkIfEmployeeWorksAtTheCompany(company: Company, employee: Employee) {
  if (company.id !== employee.companyId)
    throw new CustomError('unauthorized', 'Employee does not work at the company');
}

async function checkIfHasCardWithThisType(cardType: TransactionTypes, employeeId: number) {
  const cards = await cardRepository.findByTypeAndEmployeeId(cardType, employeeId);
  if (cards) throw new CustomError('conflict', `The employee already has a ${cardType} card`);
}

async function checkIfCardExists(cardId: number) {
  const card = await cardRepository.findById(cardId);
  if (!card) throw new CustomError('not_found', 'Card not found');
  return card;
}

function checkIfCardBelongsToEmployee(employeeId: number, card: Card) {
  if (employeeId !== card.employeeId)
    throw new CustomError('forbidden', 'Card does not belong to this employee');
}

function checkIfCardIsExpirated(card: Card) {
  const formattedDate = card.expirationDate.replace('/', '/01/');
  if (!dayjs().isBefore(dayjs(formattedDate), 'month'))
    throw new CustomError('forbidden', 'This card is expired');
}

function checkIfCardIsActive(card: Card) {
  if (card.password) throw new CustomError('conflict', 'Cannot activate card more than once');
}

function checkIfSecurityCodeIsCorrect(securityCode: string, card: Card) {
  const decryptedCode = generateDecryptedData(card.securityCode);
  if (securityCode !== decryptedCode) {
    throw new CustomError('unauthorized', 'Invalid security code');
  }
}

function checkIfCardIsBlocked(card: Card) {
  if (card.isBlocked) throw new CustomError('conflict', 'Card is already blocked');
}

function checkIfPasswordIsCorrect(password: string, card: Card) {
  const decryptedPassword = card.password ? generateDecryptedData(card.password) : '';
  if (password !== decryptedPassword) throw new CustomError('unauthorized', 'Invalid password');
}

function checkIfCardIsUnblocked(card: Card) {
  if (!card.isBlocked) throw new CustomError('conflict', 'Card is already unblocked');
}

function checkIfCardIsInactive(card: Card) {
  if (!card.password) throw new CustomError('unauthorized', 'Card is inactive');
}

async function checkIfBusinessIsRegistered(businessId: number) {
  const business = await businessRepository.findById(businessId);
  if (!business) throw new CustomError('not_found', 'Business not found');
  return business;
}

function checkIfCardTypeIsAcceptedAtBusiness(business: Business, card: Card) {
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
