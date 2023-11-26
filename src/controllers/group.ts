import { NextFunction, Request, Response } from 'express';
import { PrismaClient as PrismaClientApp } from '../../prisma/generated/client-app';
import { requestMiddleware } from '../middleware/schemaMiddleware';
import { AddGroup } from '../types/group';
import { addGroupSchema, getGroupByIdSchema } from '../schemas/groupSchema';
import { createEmailWithPassword, createEmailWithRemindMessage } from '../helpers/emailHelper';
import { createTransport, getTestMessageUrl } from 'nodemailer';
import { format } from 'date-fns';

const prisma = new PrismaClientApp();

const getAllGroupsMethod = async (req: Request, res: Response, next: NextFunction) => {
  await prisma.group
    .findMany({
      include: {
        users: {
          select: {
            id: true,
            name: true,
            surname: true,
            email: true,
            index_umk: true,
            groupId: true,
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
      res.status(201).json(data);
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
      res.status(201).json({
        message: 'Group deleted',
      });
    })
    .catch((err) => {
      next(err);
    });
};

const sendEmailWithPasswordMethod = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const group = await prisma.group
    .findUnique({
      where: {
        id: Number(id),
      },
      include: {
        users: {
          select: {
            email: true,
            password: true,
          },
        },
      },
    })
    .then((data) => data)
    .catch((err) => next(err));

  if (group) {
    const userData = group.users.map((user) => ({
      email: user.email,
      password: user.password,
    }));

    const transporter = createTransport({
      name: process.env.EMAIL_NAME,
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    userData.forEach(async (user) => {
      const emailMessage = createEmailWithPassword(user);
      const info = await transporter.sendMail(emailMessage);
      console.log('Message sent: %s', info.messageId, user.email);
      console.log('Preview:', getTestMessageUrl(info));
    });
  }

  res.status(201).json({
    message: 'Wiadomości zostały wysłane',
  });
};

const sendReminderMessageMethod = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const group = await prisma.group
    .findUnique({
      where: {
        id: Number(id),
      },
      include: {
        users: {
          select: {
            email: true,
            password: true,
          },
        },
      },
    })
    .then((data) => data)
    .catch((err) => next(err));

  if (group) {
    const userEmail = group.users.map((user) => user.email);

    const transporter = createTransport({
      name: process.env.EMAIL_NAME,
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const emailMessage = createEmailWithRemindMessage(
      userEmail,
      format(new Date(group.startTimeQuiz), 'dd-MM-yyyy HH:mm')
    );

    const info = await transporter.sendMail(emailMessage);
    console.log('Message sent: %s', info.messageId);
    console.log('Preview:', getTestMessageUrl(info));
  }

  res.status(201).json({
    message: 'Wiadomości zostały wysłane',
  });
};

const getGroupByIdMethod = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  await prisma.group
    .findUnique({
      where: {
        id: Number(id),
      },
      include: {
        users: {
          select: {
            name: true,
            surname: true,
            email: true,
            index_umk: true,
            groupId: true,
            id: true,
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

const removeUserFromGroupMethod = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  await prisma.user
    .update({
      where: {
        id: Number(id),
      },
      data: {
        groupId: null,
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

const getAllGroups = requestMiddleware(getAllGroupsMethod);
const addGroup = requestMiddleware(addGroupMethod, {
  validation: { body: addGroupSchema },
});
const removeGroup = requestMiddleware(removeGroupByIdMethod, {
  validation: { query: getGroupByIdSchema },
});
const sendEmailWithPassword = requestMiddleware(sendEmailWithPasswordMethod, {
  validation: { query: getGroupByIdSchema },
});

const sendReminderMessage = requestMiddleware(sendReminderMessageMethod, {
  validation: { query: getGroupByIdSchema },
});

const getGroupById = requestMiddleware(getGroupByIdMethod, {
  validation: { query: getGroupByIdSchema },
});

const removeUserFromGroup = requestMiddleware(removeUserFromGroupMethod, {
  validation: { query: getGroupByIdSchema },
});

export const groupControllers = {
  getAllGroups,
  addGroup,
  removeGroup,
  sendEmailWithPassword,
  sendReminderMessage,
  getGroupById,
  removeUserFromGroup,
};
