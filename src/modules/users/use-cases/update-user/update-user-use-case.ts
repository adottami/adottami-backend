import { inject, injectable } from 'tsyringe';

import UserRepository from '@/modules/repositories/user-repository';
import User from '@/modules/users/entities/user';
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
    const userById = await this.userRepository.findById(id);

    if (!userById) {
      throw new NotFoundHTTPError('User does not exists');
    }

    const emailExists = await this.userRepository.findByEmail(email);

    if (emailExists) {
      throw new BadRequestHTTPError('E-mail already registered');
    }

    const user = await this.userRepository.update(id, {
      name,
      email,
      phoneNumber,
    });

    return user;
  }
}

export default UpdateUserUseCase;
