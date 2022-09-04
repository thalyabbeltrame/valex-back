import Joi from 'joi';

export const newVirtualCardSchema = Joi.object({
  password: Joi.string()
    .regex(/^[0-9]*$/)
    .length(4)
    .required(),
});
