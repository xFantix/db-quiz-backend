import { Router } from 'express';
import { verifyTokenAndAdmin, verifyTokenAndAuthorization } from '../middleware/verifyTokenJWT';
import { groupControllers } from '../controllers/group';

const groupRoute = Router();

groupRoute.get('/all', verifyTokenAndAuthorization, groupControllers.getAllGroups);
groupRoute.get('/my', verifyTokenAndAuthorization, groupControllers.getUserGroups);
groupRoute.get('/:id', verifyTokenAndAuthorization, groupControllers.getGroupById);
groupRoute.post('/add', verifyTokenAndAdmin, groupControllers.addGroup);
groupRoute.post(
  '/email-password/group/:id',
  verifyTokenAndAdmin,
  groupControllers.sendEmailWithPassword
);
groupRoute.delete(
  '/email-password/user/:id',
  verifyTokenAndAdmin,
  groupControllers.sendEmailWithPasswordToUser
);
groupRoute.post('/email-reminder/:id', verifyTokenAndAdmin, groupControllers.sendReminderMessage);
groupRoute.delete('/remove/:id', verifyTokenAndAdmin, groupControllers.removeGroup);
groupRoute.delete('/remove-user/:id', verifyTokenAndAdmin, groupControllers.removeUserFromGroup);
groupRoute.post('/add-to-group', verifyTokenAndAuthorization, groupControllers.addQuestionToGroup);
groupRoute.post(
  '/remove-question-from-group',
  verifyTokenAndAuthorization,
  groupControllers.removeQuestionFromGroup
);
export default groupRoute;
