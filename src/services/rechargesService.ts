import * as cardRepository from '../repositories/cardRepository';
import * as companyRepository from '../repositories/companyRepository';
import * as employeeRepository from '../repositories/employeeRepository';
import * as rechargeRepository from '../repositories/rechargeRepository';
import * as validationService from './validationService';

export async function rechargeCard(apiKey: string, cardId: number, amount: number) {
  const company = await companyRepository.findByApiKey(apiKey);
  validationService.checkIfCompanyExists(company);

  const card = await cardRepository.findById(cardId);
  validationService.checkIfCardExists(card);

  const employee = await employeeRepository.findById(card.employeeId);
  validationService.checkIfEmployeeWorksForThisCompany(company, employee);

  validationService.checkIfCardIsInactive(card.password);
  validationService.checkIfCardIsExpirated(card.expirationDate);

  await rechargeRepository.insert({ cardId, amount });
}
