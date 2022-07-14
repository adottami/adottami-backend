import { Request, Response } from 'express';
import { container } from 'tsyringe';

import HTTPResponse from '@/shared/infra/http/models/http-response';
import UseCaseController from '@/shared/use-cases/use-case-controller';

import CreatePublicationUseCase from './create-publication-use-case';

class CreatePublicationController implements UseCaseController {
  async handle(request: Request, response: Response): Promise<Response> {
    const {
      name,
      description,
      category,
      gender,
      breed,
      weightInGrams,
      ageInYears,
      zipCode,
      city,
      state,
      isArchived,
      hidePhoneNumber,
      characteristics,
    } = request.body;

    const { userId } = request;

    const createPublicationUseCase = container.resolve(CreatePublicationUseCase);

    const publication = await createPublicationUseCase.execute({
      authorId: userId,
      name,
      description,
      category,
      gender,
      breed,
      weightInGrams,
      ageInYears,
      zipCode,
      city,
      state,
      isArchived,
      hidePhoneNumber,
      characteristics,
    });
    const publicationJson = publication.toJson();

    return new HTTPResponse(response).created(publicationJson);
  }
}

export default CreatePublicationController;
