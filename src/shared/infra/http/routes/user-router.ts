import { Router } from 'express';

import CreateUserController from '@/modules/users/use-cases/create-user/create-user-controller';
import UpdateUserController from '@/modules/users/use-cases/update-user/update-user-controller';

import ensureAuthenticated from '../middlewares/ensure-authenticated';
import ensureConfirmUser from '../middlewares/ensure-confirm-user';

const userRouter = Router();

const createUserController = new CreateUserController();
userRouter.post('/', createUserController.handle);

const updateUserController = new UpdateUserController();
userRouter.post('/', ensureAuthenticated, ensureConfirmUser, updateUserController.handle);

export default userRouter;
