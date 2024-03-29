import { Router } from 'express';

import CreateUserController from '@/modules/users/use-cases/create-user/create-user-controller';
import GetUserController from '@/modules/users/use-cases/get-user/get-user-controller';
import UpdateUserPasswordController from '@/modules/users/use-cases/update-password/update-user-password-controller';
import UpdateUserController from '@/modules/users/use-cases/update-user/update-user-controller';

import ensureAuthenticated from '../middlewares/ensure-authenticated';
import ensureConfirmUser from '../middlewares/ensure-confirm-user';

const userRouter = Router();

const createUserController = new CreateUserController();
userRouter.post('/', createUserController.handle);

const updateUserPasswordController = new UpdateUserPasswordController();
userRouter.patch('/:id/password', ensureAuthenticated, ensureConfirmUser, updateUserPasswordController.handle);

const getUserController = new GetUserController();
userRouter.get('/:id', ensureAuthenticated, ensureConfirmUser, getUserController.handle);

const updateUserController = new UpdateUserController();
userRouter.put('/:id', ensureAuthenticated, ensureConfirmUser, updateUserController.handle);

export default userRouter;
