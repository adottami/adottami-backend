import { Request, Response } from 'express';
import { container } from 'tsyringe';

import HTTPResponse from '@/shared/infra/http/models/http-response';
import UseCaseController from '@/shared/use-cases/use-case-controller';

import EditImagesUseCase from './edit-images-use-case';

class EditImagesController implements UseCaseController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { publicationId, newImages } = request.body;

    const editImagesUseCase = container.resolve(EditImagesUseCase);

    const publication = await editImagesUseCase.execute({
      publicationId,
      newImages,
    });

    if (publication === null) {
      return new HTTPResponse(response).ok(null);
    }

    if (publication.author.id !== request.userId) {
      return new HTTPResponse(response).forbidden();
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
