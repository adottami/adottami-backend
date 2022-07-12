import { Router } from 'express';

import publicationRouter from './publication-router';
import sessionRouter from './session-router';
import userRouter from './user-router';

const appRouter = Router();

appRouter.use('/users', userRouter);
appRouter.use('/sessions', sessionRouter);
appRouter.use('/publications', publicationRouter);

export default appRouter;
