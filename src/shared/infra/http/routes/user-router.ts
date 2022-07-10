import { Router } from 'express';

import CreateUserController from '@/modules/users/use-cases/create-user/create-user-controller';
import GetUserController from '@/modules/users/use-cases/get-user/get-user-controller';

import ensureAuthenticated from '../middlewares/ensure-authenticated';
import ensureConfirmUser from '../middlewares/ensure-confirm-user';

const userRouter = Router();

const createUserController = new CreateUserController();
userRouter.post('/', createUserController.handle);

const getUserController = new GetUserController();
userRouter.get('/:id', ensureAuthenticated, ensureConfirmUser, getUserController.handle);

export default userRouter;
