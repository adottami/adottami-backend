import { Request, Response } from 'express';
import { container } from 'tsyringe';

import HTTPResponse from '@/shared/infra/http/models/http-response';
import UseCaseController from '@/shared/use-cases/use-case-controller';

import AccessTokenUseCase from './access-token-use-case';

class AccessTokenController implements UseCaseController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { refreshToken } = request.body;

    const accessTokenUseCase = container.resolve(AccessTokenUseCase);

    const accessToken = await accessTokenUseCase.execute(refreshToken);

    return new HTTPResponse(response).created({ accessToken });
  }
}

export default AccessTokenController;
