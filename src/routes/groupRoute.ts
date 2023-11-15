import { Router } from 'express';
import { verifyTokenAndAuthorization } from '../middleware/verifyTokenJWT';
import { groupControllers } from '../controllers/group';

const groupRoute = Router();

groupRoute.get('/all', verifyTokenAndAuthorization, groupControllers.getAllGroups);

export default groupRoute;
