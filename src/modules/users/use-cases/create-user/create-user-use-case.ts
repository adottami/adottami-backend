import { inject, injectable } from 'tsyringe';

import UserRepository from '@/modules/repositories/user-repository';
import User from '@/modules/users/entities/user';
import HashProvider from '@/shared/container/providers/hash-provider/hash-provider';
import BadRequestHTTPError from '@/shared/infra/http/errors/bad-request-http-error';
import UseCaseService from '@/shared/use-cases/use-case-service';

interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
}

@injectable()
class CreateUserUseCase implements UseCaseService<CreateUserRequest, User> {
  constructor(
    @inject('UserRepository')
    private userRepository: UserRepository,

    @inject('HashProvider')
    private hashProvider: HashProvider,
  ) {}

  async execute({ name, email, password, phoneNumber }: CreateUserRequest): Promise<User> {
    const userExists = await this.userRepository.findByEmail(email);

    if (userExists) {
      throw new BadRequestHTTPError('User already exists');
    }

    const passwordHash = await this.hashProvider.generate(password);

    const userData = User.create({
      name,
      email,
      password: passwordHash,
      phoneNumber,
    });

    const user = await this.userRepository.create(userData);

    return user;
  }
}

export default CreateUserUseCase;
