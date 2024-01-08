import express, { json } from 'express';
import cors from 'cors';
import usersRoute from '../routes/userRoute';
import { errorMiddleware } from '../middleware/errorMiddleware';
import groupRoute from '../routes/groupRoute';
import quizDatabaseRoute from '../routes/quizDatabaseRoute';
import questionRoute from '../routes/questionRoute';
import userQuizRoute from '../routes/userQuizRoute';

const corsOptions = {
  origin: process.env.CORS_ORIGIN_ALLOWED,
  credentials: true,
  optionsSuccessStatus: 200,
};

const createServer = () => {
  const app = express();

  app.use(json());
  app.use(cors(corsOptions));

  app.use('/user', usersRoute);
  app.use('/group', groupRoute);
  app.use('/quiz-database', quizDatabaseRoute);
  app.use('/question', questionRoute);
  app.use('/user-quiz', userQuizRoute);

  app.use(errorMiddleware);

  console.log(process.env.DATABASE_URL_QUIZ);
  console.log(process.env.DATABASE_URL_APP);

  return app;
};

export default createServer;
