import { Router } from 'express';

import sessionRouter from './session-router';
import userRouter from './user-router';

const appRouter = Router();

appRouter.use('/users', userRouter);
appRouter.use('/sessions', sessionRouter);

export default appRouter;
