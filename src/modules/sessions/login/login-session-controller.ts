import { Request, Response } from 'express';
import { container } from 'tsyringe';

import HTTPResponse from '@/shared/infra/http/models/http-response';
import UseCaseController from '@/shared/use-cases/use-case-controller';

import LoginSessionUseCase from './login-session-use-case';

class LoginSessionController implements UseCaseController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;

    const loginSessionUseCase = container.resolve(LoginSessionUseCase);

    const { user, token } = await loginSessionUseCase.execute({
      email,
      password,
    });

    return new HTTPResponse(response).created({ user: user.toJson(), accesToken: token });
  }
}

export default LoginSessionController;
