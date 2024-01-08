import { Router } from 'express';
import { verifyTokenAndAdmin, verifyTokenAndAuthorization } from '../middleware/verifyTokenJWT';
import { quizDatabaseController } from '../controllers/quizDatabase';
import multer from 'multer';

const quizDatabaseRoute = Router();
const upload = multer({ storage: multer.memoryStorage() });

quizDatabaseRoute.post(
  '/configuration',
  verifyTokenAndAdmin,
  upload.single('file'),
  quizDatabaseController.createQuizDatabase
);
quizDatabaseRoute.post(
  '/check-request',
  verifyTokenAndAuthorization,
  quizDatabaseController.checkRequest
);

export default quizDatabaseRoute;
