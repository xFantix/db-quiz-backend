import express, { json } from 'express';
import cors from 'cors';
import usersRoute from '../routes/userRoute';
import { errorMiddleware } from '../middleware/errorMiddleware';

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

  app.use(errorMiddleware);

  return app;
};

export default createServer;
