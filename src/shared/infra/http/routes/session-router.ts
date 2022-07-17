import { Router } from 'express';

import AccessTokenController from '@/modules/sessions/use-cases/access-token/access-token-controller';
import LoginSessionController from '@/modules/sessions/use-cases/login/login-session-controller';

const sessionRouter = Router();

const loginSessionController = new LoginSessionController();
sessionRouter.post('/login', loginSessionController.handle);

const accessTokenController = new AccessTokenController();
sessionRouter.post('/access-token', accessTokenController.handle);

export default sessionRouter;
