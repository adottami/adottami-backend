import { Request, Response } from 'express';
import { container } from 'tsyringe';

import HTTPResponse from '@/shared/infra/http/models/http-response';
import UseCaseController from '@/shared/use-cases/use-case-controller';

import LogoutSessionUseCase from './logout-session-use-case';

class LogoutSessionController implements UseCaseController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { userId } = request;

    const logoutSessionUseCase = container.resolve(LogoutSessionUseCase);

    await logoutSessionUseCase.execute(userId);

    return new HTTPResponse(response).noContent();
  }
}

export default LogoutSessionController;
