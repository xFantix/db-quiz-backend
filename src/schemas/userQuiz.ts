import Joi from 'joi';

export const sendResponseUserQuiz = Joi.object().keys({
  response: Joi.string().required(),
  questionId: Joi.number().required(),
  userId: Joi.number().required(),
});
