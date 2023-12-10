import { NextFunction, Request, Response } from 'express';
import { PrismaClient as PrismaClientApp } from '../../prisma/generated/client-app';
import { Question } from '../types/question';
import { requestMiddleware } from '../middleware/schemaMiddleware';
import { addQuestionSchema, getQuestionSchema } from '../schemas/questionSchema';

const prisma = new PrismaClientApp();

const getAllQuestion = async (req: Request, res: Response, next: NextFunction) => {
  await prisma.question
    .findMany()
    .then((data) => {
      res.status(201).json(data);
    })
    .catch((err) => {
      next(err);
    });
};

const getQuestionByIdMethod = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  await prisma.question
    .findUnique({
      where: {
        id: Number(id),
      },
    })
    .then((data) => {
      res.status(201).json(data);
    })
    .catch((err) => {
      next(err);
    });
};

const createQuestionMethod = async (
  req: Request<{}, {}, Question>,
  res: Response,
  next: NextFunction
) => {
  const { answer, questionDescription, questionType } = req.body;

  await prisma.question
    .create({
      data: {
        answer,
        questionType,
        questionDescription,
      },
    })
    .then(() => {
      res.status(201).json({ message: 'Pytanie zostało dodane' });
    })
    .catch((err) => {
      next(err);
    });
};

const createQuestion = requestMiddleware(createQuestionMethod, {
  validation: { body: addQuestionSchema },
});

const getQuestionById = requestMiddleware(getQuestionByIdMethod, {
  validation: { query: getQuestionSchema },
});

export const questionController = {
  createQuestion,
  getAllQuestion,
  getQuestionById,
};
