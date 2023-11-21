import Joi from 'joi';

export const addGroupSchema = Joi.object().keys({
  name: Joi.string().required(),
  startTimeQuiz: Joi.string().required(),
  endTimeQuiz: Joi.string().required(),
});

export const getGroupByIdSchema = Joi.object({ id: Joi.string().required() });
