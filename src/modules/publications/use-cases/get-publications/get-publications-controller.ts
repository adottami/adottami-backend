import { Request, Response } from 'express';
import { container } from 'tsyringe';

import HTTPResponse from '@/shared/infra/http/models/http-response';
import UseCaseController from '@/shared/use-cases/use-case-controller';
import { BooleanAsString } from '@/types/booleans';
import { NumberAsString } from '@/types/strings';

import Publication from '../../entities/publication';
import { OrderBy } from '../../repositories/publication-repository';
import GetPublicationsUseCase from './get-publications-use-case';

interface RequestQuery {
  city?: string;
  ignoreCityCase?: BooleanAsString;
  state?: string;
  ignoreStateCase?: BooleanAsString;
  categories?: string;
  isArchived?: string;
  authorId?: string;
  page?: NumberAsString;
  perPage?: NumberAsString;
  orderBy?: OrderBy;
}

class GetPublicationsController implements UseCaseController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { city, ignoreCityCase, state, ignoreStateCase, categories, isArchived, authorId, page, perPage, orderBy } =
      request.query as RequestQuery;

    const getPublicationsUseCase = container.resolve(GetPublicationsUseCase);

    const publications = await getPublicationsUseCase.execute({
      city,
      ignoreCityCase: ignoreCityCase === 'true',
      state,
      ignoreStateCase: ignoreStateCase === 'true',
      categories,
      isArchived: isArchived === 'true',
      authorId,
      page: page === undefined ? undefined : parseInt(page),
      perPage: perPage === undefined ? undefined : parseInt(perPage),
      orderBy,
    });

    const publicationsJson = Publication.manyToJson(publications);

    return new HTTPResponse(response).ok(publicationsJson);
  }
}

export default GetPublicationsController;
