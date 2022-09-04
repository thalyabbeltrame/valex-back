import Joi from 'joi';

export const rechargeCardSchema = Joi.object({
  amount: Joi.number().integer().greater(0).required(),
});
