import { NextFunction, Request, Response } from 'express';
import { PrismaClient as PrismaClientApp } from '../../prisma/generated/client-app';
import { requestMiddleware } from '../middleware/schemaMiddleware';
import { AddGroup } from '../types/group';
import { addGroupSchema, getGroupByIdSchema } from '../schemas/groupSchema';

const prisma = new PrismaClientApp();

const getAllGroupsMethod = async (req: Request, res: Response, next: NextFunction) => {
  await prisma.group
    .findMany({
      include: {
        users: {
          select: {
            id: true,
          },
        },
      },
    })
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      next(err);
    });
};

export const addGroupMethod = async (
  req: Request<{}, {}, AddGroup>,
  res: Response,
  next: NextFunction
) => {
  const { name, startTimeQuiz, endTimeQuiz } = req.body;

  await prisma.group
    .create({
      data: {
        name,
        startTimeQuiz,
        endTimeQuiz,
      },
      include: {
        users: {
          select: {
            id: true,
          },
        },
      },
    })
    .then((data) => {
      res.status(201).send(data);
    })
    .catch((err) => next(err));
};

const removeGroupByIdMethod = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  await prisma.group
    .delete({
      where: {
        id: Number(id),
      },
    })
    .then(() => {
      res.status(201).send({
        message: 'Group deleted',
      });
    })
    .catch((err) => {
      next(err);
    });
};

const getAllGroups = requestMiddleware(getAllGroupsMethod);
const addGroup = requestMiddleware(addGroupMethod, {
  validation: { body: addGroupSchema },
});
const removeGroup = requestMiddleware(removeGroupByIdMethod, {
  validation: { query: getGroupByIdSchema },
});
export const groupControllers = {
  getAllGroups,
  addGroup,
  removeGroup,
};
