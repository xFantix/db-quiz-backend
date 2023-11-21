import { Router } from 'express';
import { verifyTokenAndAdmin, verifyTokenAndAuthorization } from '../middleware/verifyTokenJWT';
import { groupControllers } from '../controllers/group';

const groupRoute = Router();

groupRoute.get('/all', verifyTokenAndAuthorization, groupControllers.getAllGroups);
groupRoute.post('/add', verifyTokenAndAdmin, groupControllers.addGroup);
groupRoute.delete('/remove/:id', verifyTokenAndAdmin, groupControllers.removeGroup);

export default groupRoute;
