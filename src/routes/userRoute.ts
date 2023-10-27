import { Router } from 'express';
import { userControllers } from '../controllers/user';
import multer from 'multer';

const usersRoute = Router();
const upload = multer({ storage: multer.memoryStorage() });

usersRoute.post('/register', userControllers.addUser);
usersRoute.post(
  '/registerByCSV',
  upload.single('file'),
  userControllers.registerUsersFromCSVMethod
);
usersRoute.get('/getAllUsers', userControllers.getAllUsers);
usersRoute.get('/getUser/:id', userControllers.getUserById);

export default usersRoute;
