import { Request, Response } from 'express';
import { container } from 'tsyringe';

import User from '@/modules/users/entities/user';
import HTTPResponse from '@/shared/infra/http/models/http-response';
import UseCaseController from '@/shared/use-cases/use-case-controller';

import CreateUserUseCase from './create-user-use-case';

class CreateUserController implements UseCaseController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { name, email, password, phoneNumber } = request.body;

    const createUserUseCase = container.resolve(CreateUserUseCase);

    const user = await createUserUseCase.execute({
      name,
      email,
      password,
      phoneNumber,
    });

    const userJson = User.toJson(user);

    return new HTTPResponse(response).created(userJson);
  }
}

export default CreateUserController;
