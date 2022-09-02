import dayjs from 'dayjs';

import * as cardRepository from '../repositories/cardRepository';
import * as companyRepository from '../repositories/companyRepository';
import * as employeeRepository from '../repositories/employeeRepository';
import { AppError } from '../utils/classes/AppError';
import { Card } from '../utils/classes/Card';
import { generateDecryptedData, generateEncryptedData } from '../utils/cryptUtils';
import { Card as ICard } from '../utils/interfaces/cardInterface';
import { TransactionTypes } from '../utils/types/cardTypes';

export async function createNewCard(apiKey: string, employeeId: number, type: TransactionTypes) {
  await checkIfCompanyExists(apiKey);
  const employee = await checkIfEmployeeExists(employeeId);
  await checkIfHasCardWithThisType(type, employeeId);
  const cardData = new Card(employeeId, type, employee.fullName);
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
  checkIfCardIsActivated(card);
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

async function checkIfCompanyExists(apiKey: string) {
  const company = await companyRepository.findByApiKey(apiKey);
  if (!company) throw new AppError('not_found', 'Company not found');
}

async function checkIfEmployeeExists(employeeId: number) {
  const employee = await employeeRepository.findById(employeeId);
  if (!employee) throw new AppError('not_found', 'Employee not found');
  return employee;
}

async function checkIfHasCardWithThisType(cardType: TransactionTypes, employeeId: number) {
  const cards = await cardRepository.findByTypeAndEmployeeId(cardType, employeeId);
  if (cards) throw new AppError('conflict', `The employee already has a ${cardType} card`);
}

async function checkIfCardExists(cardId: number) {
  const card = await cardRepository.findById(cardId);
  if (!card) throw new AppError('not_found', 'Card not found');
  return card;
}

function checkIfCardBelongsToEmployee(employeeId: number, card: ICard) {
  if (employeeId !== card.employeeId)
    throw new AppError('forbidden', 'Card does not belong to this employee');
}

function checkIfCardIsExpirated(card: ICard) {
  const formattedDate = card.expirationDate.replace('/', '/01/');
  if (!dayjs().isBefore(dayjs(formattedDate), 'month'))
    throw new AppError('forbidden', 'This card is expired');
}

function checkIfCardIsActivated(card: ICard) {
  if (card.password) throw new AppError('conflict', 'Cannot activate card more than once');
}

function checkIfSecurityCodeIsCorrect(securityCode: string, card: ICard) {
  const decryptedCode = generateDecryptedData(card.securityCode);
  if (securityCode !== decryptedCode) {
    throw new AppError('unauthorized', 'Invalid security code');
  }
}

function checkIfCardIsBlocked(card: ICard) {
  if (card.isBlocked) throw new AppError('conflict', 'Card is already blocked');
}

function checkIfPasswordIsCorrect(password: string, card: ICard) {
  const decryptedPassword = card.password ? generateDecryptedData(card.password) : '';
  if (password !== decryptedPassword) throw new AppError('unauthorized', 'Invalid password');
}

function checkIfCardIsUnblocked(card: ICard) {
  if (!card.isBlocked) throw new AppError('conflict', 'Card is already unblocked');
}
