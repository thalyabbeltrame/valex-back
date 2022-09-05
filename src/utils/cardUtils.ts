import { faker } from '@faker-js/faker';
import dayjs from 'dayjs';

export function generateCardNumber(flag?: string): string {
  if (flag === undefined) {
    return faker.finance.creditCardNumber('#### #### #### ####');
  } else {
    const cardNumber = faker.finance.creditCardNumber(flag);
    const searchRegExp = new RegExp('-', 'g');
    return cardNumber.replace(searchRegExp, ' ');
  }
}

export function generateCardCVV(): string {
  return faker.finance.creditCardCVV();
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
