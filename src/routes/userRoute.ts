import { Router } from 'express';
import { userControllers } from '../controllers/user';
import multer from 'multer';
import { verifyTokenAndAdmin, verifyTokenAndAuthorization } from '../middleware/verifyTokenJWT';

const usersRoute = Router();
const upload = multer({ storage: multer.memoryStorage() });

usersRoute.post('/register', verifyTokenAndAdmin, userControllers.addUser);
usersRoute.post('/login', userControllers.loginUser);
usersRoute.post(
  '/registerByCSV',
  verifyTokenAndAdmin,
  upload.single('file'),
  userControllers.registerUsersFromCSVMethod
);
usersRoute.get('/all', verifyTokenAndAdmin, userControllers.getAllUsers);
usersRoute.get('/:id', verifyTokenAndAuthorization, userControllers.getUserById);
usersRoute.delete('/:id', verifyTokenAndAdmin, userControllers.removeUser);
usersRoute.post('/update-user/:id', verifyTokenAndAdmin, userControllers.changeUserData);
usersRoute.post('/refreshToken', userControllers.refreshToken);

export default usersRoute;
