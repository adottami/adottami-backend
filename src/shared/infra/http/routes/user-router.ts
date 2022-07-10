import { Router } from 'express';

import CreateUserController from '@/modules/users/use-cases/create-user/create-user-controller';
import UpdateUserPasswordController from '@/modules/users/use-cases/update-password/update-user-password-controller';

const userRouter = Router();

const createUserController = new CreateUserController();
userRouter.post('/', createUserController.handle);

const updateUserPasswordController = new UpdateUserPasswordController();
userRouter.patch('/:id/password', updateUserPasswordController.handle);

export default userRouter;
