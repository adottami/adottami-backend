import { Request, Response } from 'express';
import { container } from 'tsyringe';

import HTTPResponse from '@/shared/infra/http/models/http-response';
import UseCaseController from '@/shared/use-cases/use-case-controller';

import Publication from '../../entities/publication';
import GetPublicationsUseCase from './get-publications-use-case';

class GetPublicationsController implements UseCaseController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { city, state, categories, isArchived, authorId, page, perPage, orderBy } = request.query;

    const getPublicationsUseCase = container.resolve(GetPublicationsUseCase);

    const publications = await getPublicationsUseCase.execute({
      city: city as string,
      state: state as string,
      categories: categories as string,
      isArchived: isArchived === 'true',
      authorId: authorId as string,
      page: parseInt(page as string),
      perPage: parseInt(perPage as string),
      orderBy: orderBy as string,
    });

    const publicationsJson = Publication.manyToJson(publications);

    return new HTTPResponse(response).ok(publicationsJson);
  }
}

export default GetPublicationsController;
