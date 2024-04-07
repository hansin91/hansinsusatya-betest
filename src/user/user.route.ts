import express from 'express';
import { userController } from './user.controller';

const userRouter = express.Router();
userRouter.post('/', userController.register);
userRouter.post('/login', userController.login);

export default userRouter;
