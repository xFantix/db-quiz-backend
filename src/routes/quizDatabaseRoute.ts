import { Router } from 'express';
import { verifyTokenAndAdmin } from '../middleware/verifyTokenJWT';
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

export default quizDatabaseRoute;
