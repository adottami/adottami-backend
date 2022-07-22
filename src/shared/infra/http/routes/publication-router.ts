import { Router } from 'express';

import ListCharacterisctsController from '@/modules/publications/use-cases/characteristics/list-characteristics-controller';
import CreatePublicationController from '@/modules/publications/use-cases/create-publication/create-publication-controller';
import GetPublicationController from '@/modules/publications/use-cases/get-publication/get-publication-controller';

import ensureAuthenticated from '../middlewares/ensure-authenticated';

const publicationRouter = Router();

const createPublicationController = new CreatePublicationController();
publicationRouter.post('/', ensureAuthenticated, createPublicationController.handle);

const listCharacterisctsController = new ListCharacterisctsController();
publicationRouter.get('/characteristics', ensureAuthenticated, listCharacterisctsController.handle);

const getPublicationsController = new GetPublicationController();
publicationRouter.get('/:id', ensureAuthenticated, getPublicationsController.handle);

// const editImagesController =
// publicationRouter.get('/:id/images', ensureAuthenticated, fileUpload, editImagesController.handle);
// dentro do editImagesController, garantir que o usuario é o author da publication (findPublicationById), compare()

export default publicationRouter;
