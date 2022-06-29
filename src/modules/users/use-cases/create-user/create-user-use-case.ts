import { inject, injectable } from 'tsyringe';

import UserRepository from '@/modules/repositories/user-repository';
import User from '@/modules/users/entities/user';
import UseCaseService from '@/shared/use-cases/use-case-service';

@injectable()
class CreateUserUseCase implements UseCaseService<void, User> {
  constructor(
    @inject('UserRepository')
    private userRepository: UserRepository,
  ) {}

  async execute(): Promise<User> {
    const sampleUser = new User();
    return sampleUser;
  }
}

export default CreateUserUseCase;
