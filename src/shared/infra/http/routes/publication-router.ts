import { Router } from 'express';

import CreatePublicationController from '@/modules/publications/use-cases/create-publication/create-publication-controller';
import GetPublicationsController from '@/modules/publications/use-cases/get-publications/get-publications-controller';
import ListCharacterisctsController from '@/modules/publications/use-cases/list-characteristics/list-characteristics-controller';

import ensureAuthenticated from '../middlewares/ensure-authenticated';

const publicationRouter = Router();

const createPublicationController = new CreatePublicationController();
publicationRouter.post('/', ensureAuthenticated, createPublicationController.handle);

const listCharacterisctsController = new ListCharacterisctsController();
publicationRouter.get('/characteristics', ensureAuthenticated, listCharacterisctsController.handle);

const getPublicationsController = new GetPublicationsController();
publicationRouter.get('/', getPublicationsController.handle);

export default publicationRouter;
