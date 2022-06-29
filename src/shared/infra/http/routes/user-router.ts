import { Router } from 'express';

import CreateUserController from '@/modules/users/use-cases/create-user/create-user-controller';

const userRouter = Router();

const createUserController = new CreateUserController();
userRouter.post('/', createUserController.handle);

export default userRouter;
