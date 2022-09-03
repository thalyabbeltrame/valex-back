import { faker } from '@faker-js/faker';
import dayjs from 'dayjs';

export function generateCardNumber(): string {
  return faker.finance.creditCardNumber('#### #### #### ####');
}

export function generateExpirationDate() {
  return dayjs().add(5, 'y').format('MM/YY');
}

export function generateHolderName(fullName: string): string {
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
