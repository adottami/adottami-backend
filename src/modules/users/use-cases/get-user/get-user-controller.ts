import { Request, Response } from 'express';
import { container } from 'tsyringe';

import HTTPResponse from '@/shared/infra/http/models/http-response';
import UseCaseController from '@/shared/use-cases/use-case-controller';

import GetUserUseCase from './get-user-use-case';

class GetUserController implements UseCaseController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const getUserUseCase = container.resolve(GetUserUseCase);

    const user = await getUserUseCase.execute(id);

    const userJson = user.toJson();

    return new HTTPResponse(response).ok(userJson);
  }
}

export default GetUserController;
