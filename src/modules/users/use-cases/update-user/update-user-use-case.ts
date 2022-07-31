import { inject, injectable } from 'tsyringe';

import User from '@/modules/users/entities/user';
import UserRepository from '@/modules/users/repositories/user-repository';
import BadRequestHTTPError from '@/shared/infra/http/errors/bad-request-http-error';
import NotFoundHTTPError from '@/shared/infra/http/errors/not-found-http-error';
import UseCaseService from '@/shared/use-cases/use-case-service';

interface UpdateUserRequest {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
}

@injectable()
class UpdateUserUseCase implements UseCaseService<UpdateUserRequest, User> {
  constructor(
    @inject('UserRepository')
    private userRepository: UserRepository,
  ) {}

  async execute({ id, name, email, phoneNumber }: UpdateUserRequest): Promise<User> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundHTTPError('User does not exists');
    }

    const userWithExistingEmail = await this.userRepository.findByEmail(email);

    if (userWithExistingEmail && userWithExistingEmail.id !== user.id) {
      throw new BadRequestHTTPError('E-mail already registered');
    }

    const updatedUser = await this.userRepository.update(id, {
      name,
      email,
      phoneNumber,
    });

    return updatedUser;
  }
}

export default UpdateUserUseCase;
