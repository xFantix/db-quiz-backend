import Joi from 'joi';

export const addUserSchema = Joi.object().keys({
  name: Joi.string().required(),
  surname: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  index_umk: Joi.number().required(),
  isAdmin: Joi.boolean().required(),
  groupId: Joi.number(),
});

export const updateUserSchema = Joi.object().keys({
  groupId: Joi.number().required(),
});

export const getUserByIdSchema = Joi.object({ id: Joi.string().required() });

export const loginUserSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const refreshTokenSchema = Joi.object({
  token: Joi.string().required(),
});
