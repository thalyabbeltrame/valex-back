import Joi from 'joi';

export const posPaymentSchema = Joi.object({
  password: Joi.string()
    .regex(/^[0-9]*$/)
    .length(4)
    .required(),
  businessId: Joi.number().integer().required(),
  amount: Joi.number().integer().greater(0).required(),
});

export const onlinePaymentSchema = Joi.object({
  cardData: Joi.object({
    number: Joi.string()
      .length(19)
      .regex(/^[0-9]{4} [0-9]{4} [0-9]{4} [0-9]{4}$/)
      .required(),
    cardholderName: Joi.string().required(),
    expirationDate: Joi.string()
      .length(5)
      .regex(/^[0-9]{2}\/[0-9]{2}$/)
      .required(),
    securityCode: Joi.string()
      .regex(/^[0-9]*$/)
      .length(3)
      .required(),
  }),
  businessId: Joi.number().integer().required(),
  amount: Joi.number().integer().greater(0).required(),
});
