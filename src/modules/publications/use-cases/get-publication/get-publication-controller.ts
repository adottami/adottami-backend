import { Request, Response } from 'express';
import { container } from 'tsyringe';

import HTTPResponse from '@/shared/infra/http/models/http-response';
import UseCaseController from '@/shared/use-cases/use-case-controller';

import GetPublicationUseCase from './get-publication-use-case';

class GetPublicationController implements UseCaseController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const getPublicationUseCase = container.resolve(GetPublicationUseCase);

    const publication = await getPublicationUseCase.execute(id);

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

export default GetPublicationController;
