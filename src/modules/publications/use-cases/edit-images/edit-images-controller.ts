import { Request, Response } from 'express';
import { container } from 'tsyringe';

import HTTPResponse from '@/shared/infra/http/models/http-response';
import UseCaseController from '@/shared/use-cases/use-case-controller';

import EditImagesUseCase from './edit-images-use-case';

class EditImagesController implements UseCaseController {
  async handle(request: Request, response: Response): Promise<Response> {
    const publicationId = request.params.id;
    const newFiles = request.files ?? [];
    const editImagesUseCase = container.resolve(EditImagesUseCase);

    const publication = await editImagesUseCase.execute({
      userId: request.userId,
      publicationId,
      newFiles,
    });

    const publicationJson = publication.toJson();

    return new HTTPResponse(response).ok(publicationJson);
  }
}

export default EditImagesController;
