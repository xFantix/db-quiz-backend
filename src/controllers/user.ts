import { NextFunction, Request, Response } from 'express';
import { PrismaClient as PrismaClientApp } from '../../prisma/generated/client-app';
import { requestMiddleware } from '../middleware/schemaMiddleware';
import { addUserSchema, getUserByIdSchema } from '../schemas/userSchema';
import { RegisterUser } from '../types/user';
import csv from 'csv-parser';
import { Readable } from 'stream';

const prisma = new PrismaClientApp();

export const addUserMethod = async (
  req: Request<{}, {}, RegisterUser>,
  res: Response,
  next: NextFunction
) => {
  const { name, surname, email, index_umk, idGroup } = req.body;

  await prisma.user
    .create({
      data: {
        name,
        surname,
        email,
        index_umk,
        isAdmin: false,
        group: {
          connect: {
            id: idGroup,
          },
        },
      },
    })
    .then((data) => {
      res.status(201).send({
        message: 'User registered',
        user: data,
      });
    })
    .catch((err) => next(err));
};

const getAllUsersMethod = async (req: Request, res: Response, next: NextFunction) => {
  await prisma.user
    .findMany()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      next(err);
    });
};

const getUserByIdMethod = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  await prisma.user
    .findUnique({
      where: {
        id: Number(id),
      },
    })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => next(err));
};

const registerUsersFromCSVMethod = async (req: Request, res: Response, next: NextFunction) => {
  const { file } = req;

  if (file?.mimetype === 'text/csv') {
    const stream = Readable.from(file.buffer);
    const result: RegisterUser[] = [];

    await stream.pipe(csv()).on('data', (user: RegisterUser) => {
      result.push(user);
    });

    result.forEach(async ({ email, idGroup, index_umk, name, surname }) => {
      return await prisma.user
        .create({
          data: {
            email,
            name,
            surname,
            index_umk: Number(index_umk),
            isAdmin: false,
            group: {
              connect: {
                id: Number(idGroup),
              },
            },
          },
        })
        .catch((err) => next(err));
    });

    return res.status(201).send({
      message: 'User registered',
    });
  } else {
    return res.status(400).json({
      message: 'Bad format file',
    });
  }
};

export const getAllUsers = requestMiddleware(getAllUsersMethod);
export const addUser = requestMiddleware(addUserMethod, {
  validation: { body: addUserSchema },
});
export const getUserById = requestMiddleware(getUserByIdMethod, {
  validation: { query: getUserByIdSchema },
});

export const userControllers = {
  addUser,
  getAllUsers,
  getUserById,
  registerUsersFromCSVMethod,
};
