import Joi from 'joi';

export const newCardSchema = Joi.object({
  employeeId: Joi.number().required(),
  type: Joi.string()
    .trim()
    .valid('groceries', 'restaurant', 'transport', 'education', 'health')
    .required(),
});

export const activateCardSchema = Joi.object({
  employeeId: Joi.number().required(),
  password: Joi.string()
    .regex(/^[0-9]*$/)
    .length(4)
    .required(),
  securityCode: Joi.string()
    .regex(/^[0-9]*$/)
    .length(3)
    .required(),
});

export const blockUnblockCardSchema = Joi.object({
  password: Joi.string()
    .regex(/^[0-9]*$/)
    .length(4)
    .required(),
});
