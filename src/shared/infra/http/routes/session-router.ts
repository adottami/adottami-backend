import { Router } from 'express';

import LoginSessionController from '@/modules/sessions/login/login-session-controller';

const authenticateUserRouter = Router();

const loginSessionController = new LoginSessionController();

authenticateUserRouter.post('/login', loginSessionController.handle);

export default authenticateUserRouter;
