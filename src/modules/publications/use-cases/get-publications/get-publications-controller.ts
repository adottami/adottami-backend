import { Request, Response } from 'express';
import { container } from 'tsyringe';

import HTTPResponse from '@/shared/infra/http/models/http-response';
import UseCaseController from '@/shared/use-cases/use-case-controller';

import Publication from '../../entities/publication';
import { OrderBy } from '../../repositories/publication-repository';
import GetPublicationsUseCase from './get-publications-use-case';

class GetPublicationsController implements UseCaseController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { city, state, categories, isArchived, authorId, page, perPage, orderBy } = request.query;

    const getPublicationsUseCase = container.resolve(GetPublicationsUseCase);

    const publications = await getPublicationsUseCase.execute({
      city: city as string | undefined,
      state: state as string | undefined,
      categories: categories as string | undefined,
      isArchived: isArchived === 'true',
      authorId: authorId as string | undefined,
      page: page === undefined ? undefined : parseInt(page as string),
      perPage: perPage === undefined ? undefined : parseInt(perPage as string),
      orderBy: orderBy as OrderBy | undefined,
    });

    const publicationsJson = Publication.manyToJson(publications);

    return new HTTPResponse(response).ok(publicationsJson);
  }
}

export default GetPublicationsController;
