import { Router } from 'express';
import { verifyTokenAndAuthorization } from '../middleware/verifyTokenJWT';
import { userQuizController } from '../controllers/userQuiz';

const userQuizRoute = Router();

userQuizRoute.post('/start-quiz', verifyTokenAndAuthorization, userQuizController.createUserQuiz);
userQuizRoute.get('/status-quiz', verifyTokenAndAuthorization, userQuizController.userHasOpenQuiz);
userQuizRoute.get('/get-question', verifyTokenAndAuthorization, userQuizController.getQuestion);
userQuizRoute.post('/send-response', verifyTokenAndAuthorization, userQuizController.sendResponse);

export default userQuizRoute;
