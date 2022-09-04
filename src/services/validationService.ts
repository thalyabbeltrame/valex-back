import dayjs from 'dayjs';

import { Business } from '../interfaces/businessInterface';
import { Card } from '../interfaces/cardInterface';
import { Company } from '../interfaces/companyInterface';
import { Employee } from '../interfaces/employeeInterface';
import * as businessRepository from '../repositories/businessRepository';
import * as cardRepository from '../repositories/cardRepository';

import { TransactionTypes } from '../types/cardTypes';
import { generateDecryptedData } from '../utils/cryptUtils';
import { CustomError } from '../utils/CustomError';

export function checkIfCompanyExists(company: Company | undefined) {
  if (!company) throw new CustomError('not_found', 'Company not found');
  return company;
}

export function checkIfEmployeeExists(employee: Employee) {
  if (!employee) throw new CustomError('not_found', 'Employee not found');
  return employee;
}

export function checkIfEmployeeWorksForThisCompany(company: Company, employee: Employee) {
  if (company.id !== employee.companyId)
    throw new CustomError('unauthorized', 'Employee does not work for this company');
}

export async function checkIfAlreadyHasCardWithThisType(
  cardType: TransactionTypes,
  employeeId: number
) {
  const cards = await cardRepository.findByTypeAndEmployeeId(cardType, employeeId);
  if (cards) throw new CustomError('conflict', `The employee already has a ${cardType}-type card`);
}

export function checkIfCardExists(card: Card) {
  if (!card) throw new CustomError('not_found', 'Card not found');
  return card;
}

export function checkIfCardBelongsToEmployee(card: Card, employeeId: number) {
  if (employeeId !== card.employeeId)
    throw new CustomError('forbidden', 'Card does not belong to this employee');
}

export function checkIfCardIsExpirated(expirationDate: string) {
  const formattedDate = expirationDate.replace('/', '/01/');
  if (!dayjs().isBefore(dayjs(formattedDate), 'month'))
    throw new CustomError('forbidden', 'This card is expired');
}

export function checkIfCardIsAlreadyActive(password: string | undefined) {
  if (password) throw new CustomError('conflict', 'Cannot activate card more than once');
}

export function checkIfSecurityCodeIsIncorrect(securityCode: string, card: Card) {
  const decryptedCode = generateDecryptedData(card.securityCode);
  if (securityCode !== decryptedCode) {
    throw new CustomError('unauthorized', 'Invalid security code');
  }
}

export function checkIfCardIsBlocked(isBlocked: boolean) {
  if (isBlocked) throw new CustomError('conflict', 'Card is blocked');
}

export function checkIfPasswordIsIncorrect(password: string, card: Card) {
  const decryptedPassword = card.password ? generateDecryptedData(card.password) : '';
  if (password !== decryptedPassword) throw new CustomError('unauthorized', 'Invalid password');
}

export function checkIfCardIsUnblocked(isBlocked: boolean) {
  if (!isBlocked) throw new CustomError('conflict', 'Card is unblocked');
}

export function checkIfCardIsInactive(password: string | undefined) {
  if (!password) throw new CustomError('unauthorized', 'Card is inactive');
}

export async function checkIfBusinessIsRegistered(businessId: number) {
  const business = await businessRepository.findById(businessId);
  if (!business) throw new CustomError('not_found', 'Business not found');
  return business;
}

export function checkIfCardTypeIsAccepted(business: Business, card: Card) {
  if (business.type !== card.type)
    throw new CustomError('unauthorized', 'The business does not accept this card type');
}

export async function checkIfBalanceIsEnough(balance: number, amount: number) {
  if (amount > balance) throw new CustomError('bad_request', 'Insufficient balance');
}

export function checkIfCardIsVirtual(isVirtual: boolean) {
  if (isVirtual)
    throw new CustomError('bad_request', 'Cannot create a virtual card from another virtual card');
}

export function checkIfCardIsNotVirtual(isVirtual: boolean) {
  if (!isVirtual) throw new CustomError('bad_request', 'Only virtual cards can be deleted');
}
