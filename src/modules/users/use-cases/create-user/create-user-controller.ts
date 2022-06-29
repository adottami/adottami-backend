import { Request, Response } from 'express';
import { container } from 'tsyringe';

import HTTPResponse from '@/shared/infra/http/models/http-response';
import UseCaseController from '@/shared/use-cases/use-case-controller';

import CreateUserUseCase from './create-user-use-case';

class CreateUserController implements UseCaseController {
  handle = async (_request: Request, response: Response): Promise<Response> => {
    const createUserUseCase = container.resolve(CreateUserUseCase);

    const user = await createUserUseCase.execute();

    return new HTTPResponse(response).ok(user);
  };
}

export default CreateUserController;
