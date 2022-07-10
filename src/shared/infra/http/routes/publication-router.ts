import { Router } from 'express';

import CreatePublicationController from '@/modules/publications/use-cases/create-publication/create-publication-controller';

import ensureAuthenticated from '../middlewares/ensure-authenticated';

const publicationRouter = Router();

const createPublicationController = new CreatePublicationController();
publicationRouter.post('/', ensureAuthenticated, createPublicationController.handle);

export default publicationRouter;
