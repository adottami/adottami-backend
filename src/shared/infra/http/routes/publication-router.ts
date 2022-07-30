import { Router } from 'express';

import CreatePublicationController from '@/modules/publications/use-cases/create-publication/create-publication-controller';
import EditImagesController from '@/modules/publications/use-cases/edit-images/edit-images-controller';
import GetPublicationController from '@/modules/publications/use-cases/get-publication/get-publication-controller';
import GetPublicationsController from '@/modules/publications/use-cases/get-publications/get-publications-controller';
import ListCharacterisctsController from '@/modules/publications/use-cases/list-characteristics/list-characteristics-controller';
import RemovePublicationController from '@/modules/publications/use-cases/remove-publication/remove-publication-controller';
import UpdatePublicationController from '@/modules/publications/use-cases/update-publication/update-publication-controller';

import ensureAuthenticated from '../middlewares/ensure-authenticated';
import fileUpload from '../middlewares/file-upload';

const publicationRouter = Router();

const createPublicationController = new CreatePublicationController();
publicationRouter.post('/', ensureAuthenticated, createPublicationController.handle);

const listCharacterisctsController = new ListCharacterisctsController();
publicationRouter.get('/characteristics', ensureAuthenticated, listCharacterisctsController.handle);

const getPublicationsController = new GetPublicationsController();
publicationRouter.get('/', getPublicationsController.handle);

const getPublicationController = new GetPublicationController();
publicationRouter.get('/:id', ensureAuthenticated, getPublicationController.handle);

const updatePublicationController = new UpdatePublicationController();
publicationRouter.patch('/:id', ensureAuthenticated, updatePublicationController.handle);

const editImagesController = new EditImagesController();
publicationRouter.patch(
  '/:id/images',
  ensureAuthenticated,
  fileUpload({
    fieldName: 'images',
    mimeTypes: ['image/jpeg', 'image/png'],
    limits: {
      maxFiles: 5,
      maxFileSizeInBytes: 1024 * 1024 * 5, // 5MB
    },
  }),
  editImagesController.handle,
);

const removePublicationController = new RemovePublicationController();
publicationRouter.delete('/:id', ensureAuthenticated, removePublicationController.handle);

export default publicationRouter;
