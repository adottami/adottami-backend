import { Request, Response } from 'express';
import { container } from 'tsyringe';

import HTTPResponse from '@/shared/infra/http/models/http-response';
import UseCaseController from '@/shared/use-cases/use-case-controller';

import UpdatePublicationUseCase from './update-publication-use-case';

class UpdatePublicationController implements UseCaseController {
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

    const { publicationId } = request.params;

    const { userId } = request.body.userId;

    const updatePublicationUseCase = container.resolve(UpdatePublicationUseCase);

    const updatedPublication = await updatePublicationUseCase.execute({
      userId,
      publicationId,
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

    const publicationJson = updatedPublication.toJson();

    return new HTTPResponse(response).ok({
      ...publicationJson,
      author: {
        ...publicationJson.author,
        phoneNumber: updatedPublication.hidePhoneNumber ? undefined : updatedPublication.author.phoneNumber,
      },
    });
  }
}

export default UpdatePublicationController;
