import { Payment } from '../interfaces/paymentInterface';

export type PaymentWithBusinessName = Payment & { businessName: string };

export type PaymentInsertData = Omit<Payment, 'id' | 'timestamp'>;
