import { inject, injectable } from 'tsyringe';

import UserRepository from '@/modules/users/repositories/user-repository';
import HashProvider from '@/shared/container/providers/hash-provider/hash-provider';
import TokenProvider from '@/shared/container/providers/token-provider/token-provider';
import BadRequestHTTPError from '@/shared/infra/http/errors/bad-request-http-error';
import UseCaseService from '@/shared/use-cases/use-case-service';

import User from '../../../users/entities/user';
import RefreshTokenRepository from '../../repositories/refresh-token-repository';

interface LoginSessionRequest {
  email: string;
  password: string;
}

interface LoginSessionResponse {
  user: User;
  token: string;
  refreshToken: string;
}

@injectable()
class LoginSessionUseCase implements UseCaseService<LoginSessionRequest, LoginSessionResponse> {
  constructor(
    @inject('UserRepository')
    private userRepository: UserRepository,

    @inject('RefreshTokenRepository')
    private refreshTokenRepository: RefreshTokenRepository,

    @inject('HashProvider')
    private hashProvider: HashProvider,

    @inject('TokenProvider')
    private tokenProvider: TokenProvider,
  ) {}

  async execute({ email, password }: LoginSessionRequest): Promise<LoginSessionResponse> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new BadRequestHTTPError('Email or password incorrect');
    }

    const isValidPassword = await this.hashProvider.compare(password, user.password);

    if (!isValidPassword) {
      throw new BadRequestHTTPError('Email or password incorrect');
    }

    const token = this.tokenProvider.generate({
      subject: user.id,
      expiresIn: '15m',
    });

    const refreshTokenExpiration = new Date();
    refreshTokenExpiration.setMonth(refreshTokenExpiration.getMonth() + 1);
    const { id } = await this.refreshTokenRepository.create(user.id, refreshTokenExpiration);

    return { user, token, refreshToken: id };
  }
}

export default LoginSessionUseCase;
