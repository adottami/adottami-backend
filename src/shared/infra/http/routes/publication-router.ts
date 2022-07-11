import { Router } from 'express';

import ListCharacterisctsController from '@/modules/publications/use-cases/characteristics/list-characteristics-controller';

import ensureAuthenticated from '../middlewares/ensure-authenticated';

const publicationRouter = Router();

const listCharacterisctsController = new ListCharacterisctsController();
publicationRouter.get('/characteristics', ensureAuthenticated, listCharacterisctsController.handle);

export default publicationRouter;
