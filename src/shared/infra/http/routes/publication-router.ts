import { Router } from 'express';

import ListCharacterisctsController from '@/modules/publications/use-cases/characteristics/list-characteristics-controller';
import CreatePublicationController from '@/modules/publications/use-cases/create-publication/create-publication-controller';

import ensureAuthenticated from '../middlewares/ensure-authenticated';

const publicationRouter = Router();

const createPublicationController = new CreatePublicationController();
publicationRouter.post('/', ensureAuthenticated, createPublicationController.handle);

const listCharacterisctsController = new ListCharacterisctsController();
publicationRouter.get('/characteristics', ensureAuthenticated, listCharacterisctsController.handle);

export default publicationRouter;
