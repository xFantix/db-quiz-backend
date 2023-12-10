import { Router } from 'express';
import { verifyTokenAndAuthorization } from '../middleware/verifyTokenJWT';
import { questionController } from '../controllers/question';

const questionRoute = Router();

questionRoute.get('/all', verifyTokenAndAuthorization, questionController.getAllQuestion);
questionRoute.post('/add', verifyTokenAndAuthorization, questionController.createQuestion);
questionRoute.get('/:id', verifyTokenAndAuthorization, questionController.getQuestionById);

export default questionRoute;
