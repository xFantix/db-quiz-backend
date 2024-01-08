import Joi from 'joi';

export const checkRequestSchema = Joi.object({ request: Joi.string().required() });
