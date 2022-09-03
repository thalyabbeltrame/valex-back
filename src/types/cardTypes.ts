import { Card } from '../interfaces/cardInterface';

export type TransactionTypes = 'groceries' | 'restaurant' | 'transport' | 'education' | 'health';

export type CardInsertData = Omit<Card, 'id'>;

export type CardUpdateData = Partial<Card>;
