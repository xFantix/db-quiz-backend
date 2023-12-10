import { NextFunction, Request, Response } from 'express';
import { PrismaClient as PrismaClientApp } from '../../prisma/generated/client-app';
import { requestMiddleware } from '../middleware/schemaMiddleware';
import {
  addUserSchema,
  getUserByIdSchema,
  loginUserSchema,
  refreshTokenSchema,
  updateUserSchema,
} from '../schemas/userSchema';
import { AuthUser, LoginUser, RefreshToken, RegisterUser } from '../types/user';
import { processCSV } from '../helpers/fileHelper';
import { generateAccessToken, generatePassword, hashPassword } from '../helpers/userAuthHelper';
import CryptoJS from 'crypto-js';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClientApp();

let refreshTokens: string[] = [];

export const addUserMethod = async (
  req: Request<{}, {}, RegisterUser>,
  res: Response,
  next: NextFunction
) => {
  const { name, surname, email, password, index_umk, groupId } = req.body;

  await prisma.user
    .create({
      data: {
        name,
        surname,
        password: hashPassword(password),
        email,
        index_umk,
        isAdmin: false,
        groupId: groupId || null,
      },
    })
    .then((data) => {
      const { password, isAdmin, ...rest } = data;
      res.status(201).send(rest);
    })
    .catch((err) => next(err));
};

const getAllUsersMethod = async (req: Request, res: Response, next: NextFunction) => {
  await prisma.user
    .findMany({
      select: {
        groupId: true,
        index_umk: true,
        name: true,
        surname: true,
        email: true,
        id: true,
        group: true,
      },
    })
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      next(err);
    });
};

const removeUserByIdMethod = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  await prisma.user
    .delete({
      where: {
        id: Number(id),
      },
    })
    .then(() => {
      res.status(201).send({
        message: 'User deleted',
      });
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
    const usersData = await processCSV(file);

    await prisma.user
      .createMany({
        data: usersData.map(({ name, surname, email, index_umk, groupId }) => ({
          name,
          surname,
          email,
          isAdmin: false,
          password: generatePassword(),
          index_umk: Number(index_umk),
          groupId: Number(groupId),
        })),
        skipDuplicates: true,
      })
      .then((data) => {
        res.status(201).send(data);
      })
      .catch((err) => next(err));
  } else {
    return res.status(400).json({
      message: 'Bad format file',
    });
  }
};

const loginUserMethod = async (
  req: Request<{}, {}, LoginUser>,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  const user = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (!user)
    return res.status(403).json({
      message: 'Użytkownik nie istnieje',
    });

  const hashedPassword = CryptoJS.AES.decrypt(user.password, `${process.env.SECRET_KEY_AES}`);
  const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

  if (originalPassword !== password) {
    return res.status(403).json({
      message: 'Niepoprawne hasło',
    });
  }

  const accessToken = generateAccessToken({ id: String(user.id), isAdmin: user.isAdmin });

  const refreshToken = jwt.sign(user, `${process.env.JWT_REFRESH_KEY}`);
  refreshTokens.push(refreshToken);

  const { password: passwordUser, ...others } = user;

  return res.status(200).json({
    user: others,
    accessToken,
    refreshToken,
  });
};

const refreshTokenMethod = async (
  req: Request<{}, {}, RefreshToken>,
  res: Response,
  next: NextFunction
) => {
  const { token } = req.body;

  if (!refreshTokens.includes(token)) return res.sendStatus(403);

  jwt.verify(token, `${process.env.JWT_REFRESH_KEY}`, (err, user) => {
    if (err) return res.sendStatus(403);
    const dataUser: AuthUser = user as AuthUser;
    const accessToken = generateAccessToken({ id: String(dataUser.id), isAdmin: dataUser.isAdmin });
    res.json({ accessToken: accessToken });
  });
};

const changeUserDataMethod = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { groupId } = req.body;

  await prisma.user
    .update({
      where: {
        id: Number(id),
      },
      data: {
        groupId,
      },
    })
    .then((data) => {
      const { password, isAdmin, ...rest } = data;
      res.status(201).json(rest);
    })
    .catch((err) => {
      next(err);
    });
};

const removeUser = requestMiddleware(removeUserByIdMethod, {
  validation: { query: getUserByIdSchema },
});

const loginUser = requestMiddleware(loginUserMethod, {
  validation: { body: loginUserSchema },
});
const getAllUsers = requestMiddleware(getAllUsersMethod);
const addUser = requestMiddleware(addUserMethod, {
  validation: { body: addUserSchema },
});
const getUserById = requestMiddleware(getUserByIdMethod, {
  validation: { query: getUserByIdSchema },
});

const refreshToken = requestMiddleware(refreshTokenMethod, {
  validation: { body: refreshTokenSchema },
});

const changeUserData = requestMiddleware(changeUserDataMethod, {
  validation: { body: updateUserSchema },
});

export const userControllers = {
  addUser,
  getAllUsers,
  getUserById,
  registerUsersFromCSVMethod,
  loginUser,
  refreshToken,
  removeUser,
  changeUserData,
};
