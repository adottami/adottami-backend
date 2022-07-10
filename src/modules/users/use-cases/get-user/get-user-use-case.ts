import { inject, injectable } from 'tsyringe';

import User from '@/modules/users/entities/user';
import UserRepository from '@/modules/users/repositories/user-repository';
import NotFoundHTTPError from '@/shared/infra/http/errors/not-found-http-error';
import UseCaseService from '@/shared/use-cases/use-case-service';

@injectable()
class GetUserUseCase implements UseCaseService<string, User> {
  constructor(
    @inject('UserRepository')
    private userRepository: UserRepository,
  ) {}

  async execute(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundHTTPError('User does not exists');
    }

    return user;
  }
}

export default GetUserUseCase;
