import { Request, Response } from 'express';
import { container } from 'tsyringe';

import HTTPResponse from '@/shared/infra/http/models/http-response';
import UseCaseController from '@/shared/use-cases/use-case-controller';

import ListCharacterisctsUseCase from './list-characteristics-use-case';

class ListCharacterisctsController implements UseCaseController {
  async handle(request: Request, response: Response): Promise<Response> {
    const listCharacterisctsUseCase = container.resolve(ListCharacterisctsUseCase);

    const characteristics = await listCharacterisctsUseCase.execute();

    return new HTTPResponse(response).ok(characteristics);
  }
}

export default ListCharacterisctsController;
