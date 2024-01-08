import Joi from 'joi';

export const addQuestionSchema = Joi.object().keys({
  questionDescription: Joi.string().required(),
  questionType: Joi.string().required(),
  answer: Joi.string().required(),
});

export const getQuestionSchema = Joi.object({ id: Joi.string().required() });

export const addQuestionToGroupSchema = Joi.object().keys({
  groupId: Joi.number().required(),
  questionId: Joi.number().required(),
});
