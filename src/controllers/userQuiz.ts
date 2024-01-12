import { IGetUserAuthInfoRequest } from '../types/user';
import { NextFunction, Request, Response } from 'express';
import { PrismaClient as PrismaClientApp } from '../../prisma/generated/client-app';
import { PrismaClient as PrismaClientApp2 } from '../../prisma/generated/client-quiz';
import { AnswerObject, ResponseUserQuiz } from '../types/userQuiz';
import _ from 'lodash';
import { requestMiddleware } from '../middleware/schemaMiddleware';
import { sendResponseUserQuiz } from '../schemas/userQuiz';

const prisma = new PrismaClientApp();
const prisma2 = new PrismaClientApp2();

const createUserQuiz = async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
  await prisma.userQuiz
    .create({
      data: {
        startQuiz: new Date(),
        isOpen: true,
        counter: 0,
        points: 0,
        user: {
          connect: {
            id: Number(req.user?.id),
          },
        },
      },
    })
    .then((data) => {
      res.status(201).json(data);
    })
    .catch((err) => {
      next(err);
    });
};

const userHasOpenQuiz = async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
  await prisma.user
    .findUnique({
      where: {
        id: Number(req.user?.id),
      },
      select: {
        userQuizId: true,
      },
    })
    .then((data) => {
      res.status(200).json(data?.userQuizId);
    });
};

const getQuestion = async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
  const time = await prisma.user.findUnique({
    where: { id: Number(req.user?.id) },
    select: {
      group: {
        select: {
          time: true,
        },
      },
    },
  });

  await prisma.user
    .findUnique({
      where: { id: Number(req.user?.id) },
      select: {
        group: {
          select: {
            questions: true,
          },
        },
        userQuiz: true,
      },
    })
    .then((data) => {
      const questionNumber = data?.userQuiz?.counter;
      if (questionNumber !== undefined) {
        const question = data?.group?.questions[questionNumber as number];
        return res.status(200).json({ ...data?.userQuiz, question, time: time?.group?.time });
      }
      res.status(200).json(null);
    });
};

const sendResponseMethod = async (
  req: Request<{}, {}, ResponseUserQuiz>,
  res: Response,
  next: NextFunction
) => {
  try {
    const userQuiz = await prisma.userQuiz.findFirst({
      where: {
        user: {
          id: Number(req.body.userId),
        },
      },
    });

    const questionWithAnswer = await prisma.question.findUnique({
      where: { id: Number(req.body.questionId) },
      include: {
        group: true,
      },
    });

    const group = await prisma.user.findUnique({
      where: { id: Number(req.body.userId) },
      select: {
        group: {
          select: {
            questions: true,
          },
        },
      },
    });

    const correctAnswers: AnswerObject[] = JSON.parse(questionWithAnswer?.answer || '[]');
    const sortAnswer = correctAnswers.sort((a, b) => a.id - b.id);

    const data = await prisma2.$queryRawUnsafe(req.body.response);
    const response: AnswerObject[] = data as AnswerObject[];
    const sortUserResponse = response.sort((a, b) => a.id - b.id);

    if (userQuiz) {
      const updateQuiz = await prisma.userQuiz.update({
        where: { id: userQuiz.id },
        data: {
          answers: {
            create: {
              answer: req.body.response,
            },
          },
          counter: {
            increment: 1,
          },
          points: {
            increment: _.isEqual(sortAnswer, sortUserResponse) ? 1 : 0,
          },
        },
      });

      if (updateQuiz.counter === group?.group?.questions.length) {
        await prisma.userQuiz.update({
          where: { id: userQuiz.id },
          data: {
            isOpen: {
              set: false,
            },
          },
        });

        return res.status(200).send('Quiz updated successfully');
      }
    }

    return res.status(200).send('Quiz updated successfully');
  } catch (err) {
    next(err);
  }
};

const sendResponse = requestMiddleware(sendResponseMethod, {
  validation: { body: sendResponseUserQuiz },
});

export const userQuizController = {
  createUserQuiz,
  userHasOpenQuiz,
  getQuestion,
  sendResponse,
};
