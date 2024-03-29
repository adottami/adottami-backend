import { inject, injectable } from 'tsyringe';

import UserRepository from '@/modules/users/repositories/user-repository';
import HashProvider from '@/shared/container/providers/hash-provider/hash-provider';
import BadRequestHTTPError from '@/shared/infra/http/errors/bad-request-http-error';
import UseCaseService from '@/shared/use-cases/use-case-service';

interface UpdateUserPasswordRequest {
  id: string;
  currentPassword: string;
  newPassword: string;
}

@injectable()
class UpdateUserPasswordUseCase implements UseCaseService<UpdateUserPasswordRequest, void> {
  constructor(
    @inject('UserRepository')
    private userRepository: UserRepository,

    @inject('HashProvider')
    private hashProvider: HashProvider,
  ) {}

  async execute({ id, currentPassword, newPassword }: UpdateUserPasswordRequest): Promise<void> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new BadRequestHTTPError('User does not exists');
    }

    const passwordMatch = await this.hashProvider.compare(currentPassword, user.password);

    if (!passwordMatch) {
      throw new BadRequestHTTPError('Current password is invalid');
    }

    const passwordHash = await this.hashProvider.generate(newPassword);

    await this.userRepository.updatePassword(id, passwordHash);
  }
}

export default UpdateUserPasswordUseCase;
