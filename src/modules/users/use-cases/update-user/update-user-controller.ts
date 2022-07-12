import { Request, Response } from 'express';
import { container } from 'tsyringe';

import HTTPResponse from '@/shared/infra/http/models/http-response';
import UseCaseController from '@/shared/use-cases/use-case-controller';

import UpdateUserUseCase from './update-user-use-case';

class CreateUserController implements UseCaseController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { name, email, phoneNumber } = request.body;

    const updateUserUseCase = container.resolve(UpdateUserUseCase);

    const user = await updateUserUseCase.execute({
      id,
      name,
      email,
      phoneNumber,
    });

    const userJson = user.toJson();

    return new HTTPResponse(response).ok(userJson);
  }
}

export default CreateUserController;
