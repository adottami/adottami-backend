import { inject, injectable } from 'tsyringe';

import UserRepository from '@/modules/users/repositories/user-repository';
import BadRequestHTTPError from '@/shared/infra/http/errors/bad-request-http-error';
import UseCaseService from '@/shared/use-cases/use-case-service';

import RefreshTokenRepository from '../../repositories/refresh-token-repository';

@injectable()
class LogoutSessionUseCase implements UseCaseService<string, void> {
  constructor(
    @inject('UserRepository')
    private userRepository: UserRepository,

    @inject('RefreshTokenRepository')
    private refreshTokenRepository: RefreshTokenRepository,
  ) {}

  async execute(userId: string): Promise<void> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new BadRequestHTTPError('User not found');
    }

    await this.refreshTokenRepository.deleteMany(userId);
  }
}

export default LogoutSessionUseCase;
