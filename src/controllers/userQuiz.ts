import { IGetUserAuthInfoRequest } from '../types/user';
import { NextFunction, Request, Response } from 'express';
import { PrismaClient as PrismaClientApp } from '../../prisma/generated/client-app';

const prisma = new PrismaClientApp();

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

export const userQuizController = {
  createUserQuiz,
  userHasOpenQuiz,
  getQuestion,
};
