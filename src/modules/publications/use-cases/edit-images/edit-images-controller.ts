import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CloudinaryStorageProvider from '@/shared/container/providers/storage-provider/implementations/cloudinary-storage-provider/cloudinary-storage-provider';
import HTTPResponse from '@/shared/infra/http/models/http-response';
import UseCaseController from '@/shared/use-cases/use-case-controller';

import EditImagesUseCase from './edit-images-use-case';

class EditImagesController implements UseCaseController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { publicationId, newImages } = request.body;

    const editImagesUseCase = container.resolve(EditImagesUseCase);

    // const storageProvider = container.resolve(CloudinaryStorageProvider);

    // const removePromises = request.files?.map((file) => storageProvider.remove(file.path));

    // await Promise.all(removePromises);

    // const savePromises = request.files?.map((file) => storageProvider.save(file.path));

    // await Promise.all(savePromises);

    const publication = await editImagesUseCase.execute({
      publicationId,
      newImages,
    });

    if (publication === null) {
      return new HTTPResponse(response).ok(null);
    }

    const publicationJson = publication.toJson();

    return new HTTPResponse(response).ok({
      ...publicationJson,
      author: {
        ...publicationJson.author,
        phoneNumber: publication.hidePhoneNumber ? undefined : publication.author.phoneNumber,
      },
    });
  }
}

export default EditImagesController;
