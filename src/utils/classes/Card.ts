import { faker } from '@faker-js/faker';
import dayjs from 'dayjs';

import { generateEncryptedData } from '../cryptUtils';
import { TransactionTypes } from '../types/cardTypes';

export class Card {
  employeeId: number;
  number: string = this.generateCardNumber();
  cardholderName: string;
  securityCode: string = generateEncryptedData(faker.finance.creditCardCVV());
  expirationDate: string = this.generateExpirationDate();
  password?: string | undefined = undefined;
  isVirtual: boolean = false;
  originalCardId?: number | undefined = undefined;
  isBlocked: boolean = false;
  type: TransactionTypes;

  constructor(employeeId: number, type: TransactionTypes, cardholderName: string) {
    this.employeeId = employeeId;
    this.cardholderName = this.generateHolderName(cardholderName);
    this.type = type;
  }

  private generateCardNumber(): string {
    return faker.finance.creditCardNumber('#### #### #### ####');
  }

  private generateExpirationDate() {
    return dayjs().add(5, 'y').format('MM/YY');
  }

  private generateHolderName(fullName: string): string {
    const nameArray = fullName.split(' ');

    const holderName = nameArray.reduce((prev, curr, index, array): string => {
      if (index === 0 || index === array.length - 1) {
        return prev + ` ${curr.toUpperCase()}`;
      }
      if (curr.length >= 3) {
        return prev + ` ${curr[0].toUpperCase()}`;
      }
      return prev;
    }, '');

    return holderName.trim();
  }
}
