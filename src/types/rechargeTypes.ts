import { Recharge } from '../interfaces/rechargeInterface';

export type RechargeInsertData = Omit<Recharge, 'id' | 'timestamp'>;
