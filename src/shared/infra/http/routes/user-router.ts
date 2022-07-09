import { Router } from 'express';

import CreateUserController from '@/modules/users/use-cases/create-user/create-user-controller';
import GetUserController from '@/modules/users/use-cases/get-user/get-user-controller';

const userRouter = Router();

const createUserController = new CreateUserController();
userRouter.post('/', createUserController.handle);

const getUserController = new GetUserController();
userRouter.get('/:id', getUserController.handle);

export default userRouter;
