import { Router } from 'express';

import LoginSessionController from '@/modules/sessions/login/login-session-controller';

const sessionRouter = Router();

const loginSessionController = new LoginSessionController();

sessionRouter.post('/login', loginSessionController.handle);

export default sessionRouter;
