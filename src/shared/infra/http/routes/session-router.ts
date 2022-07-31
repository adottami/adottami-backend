import { Router } from 'express';

import AccessTokenController from '@/modules/sessions/use-cases/access-token/access-token-controller';
import LoginSessionController from '@/modules/sessions/use-cases/login/login-session-controller';
import LogoutSessionController from '@/modules/sessions/use-cases/logout/logout-session-controller';

import ensureAuthenticated from '../middlewares/ensure-authenticated';

const sessionRouter = Router();

const loginSessionController = new LoginSessionController();
sessionRouter.post('/login', loginSessionController.handle);

const accessTokenController = new AccessTokenController();
sessionRouter.post('/access-token', accessTokenController.handle);

const logoutSessionController = new LogoutSessionController();
sessionRouter.post('/logout', ensureAuthenticated, logoutSessionController.handle);

export default sessionRouter;
