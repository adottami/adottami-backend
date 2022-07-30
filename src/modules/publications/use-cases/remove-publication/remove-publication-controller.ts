import { Request, Response } from 'express';
import { container } from 'tsyringe';

import HTTPResponse from '@/shared/infra/http/models/http-response';
import UseCaseController from '@/shared/use-cases/use-case-controller';

import RemovePublicationUseCase from './remove-publication-use-case';

class RemovePublicationController implements UseCaseController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { userId } = request;
    const { id } = request.params;
    const removePublicationUseCase = container.resolve(RemovePublicationUseCase);

    await removePublicationUseCase.execute({ userId, id });

    return new HTTPResponse(response).ok();
  }
}

export default RemovePublicationController;
