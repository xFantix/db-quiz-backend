import Joi from 'joi';

export const addUserSchema = Joi.object().keys({
  name: Joi.string().required(),
  surname: Joi.string().required(),
  email: Joi.string().email().required(),
  index_umk: Joi.number().required(),
  isAdmin: Joi.boolean().required(),
  idGroup: Joi.number().required(),
});

export const getUserByIdSchema = Joi.object({ id: Joi.string().required() });
