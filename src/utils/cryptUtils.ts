import Cryptr from 'cryptr';

import '../config/index';

const CRYPTR_SECRET_KEY = process.env.CRYPTR_SECRET_KEY || 'CRYPTR_SECRET_KEY';
const cryptr = new Cryptr(CRYPTR_SECRET_KEY);

export const generateEncryptedData = (data: string): string => {
  return cryptr.encrypt(data);
};

export const generateDecryptedData = (data: string): string => cryptr.decrypt(data);
