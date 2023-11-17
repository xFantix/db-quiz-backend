import { NextFunction, Request, Response } from 'express';
import { PrismaClient as PrismaClientApp } from '../../prisma/generated/client-app';
import { requestMiddleware } from '../middleware/schemaMiddleware';

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

const getAllGroups = requestMiddleware(getAllGroupsMethod);

export const groupControllers = {
  getAllGroups,
};
