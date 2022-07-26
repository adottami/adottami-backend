import { Request, Response } from 'express';
import { container } from 'tsyringe';

import HTTPResponse from '@/shared/infra/http/models/http-response';
import UseCaseController from '@/shared/use-cases/use-case-controller';

import UpdateUserPasswordUseCase from './update-user-password-use-case';

class UpdateUserPasswordController implements UseCaseController {
  handle = async (request: Request, response: Response): Promise<Response> => {
    const { id } = request.params;
    const { currentPassword, newPassword } = request.body;

    const updateUserPasswordUseCase = container.resolve(UpdateUserPasswordUseCase);

    await updateUserPasswordUseCase.execute({
      id,
      currentPassword,
      newPassword,
    });

    return new HTTPResponse(response).noContent();
  };
}

export default UpdateUserPasswordController;
