import { inject, injectable } from 'tsyringe';

import TokenProvider from '@/shared/container/providers/token-provider/token-provider';
import BadRequestHTTPError from '@/shared/infra/http/errors/bad-request-http-error';
import UnauthorizedHTTPError from '@/shared/infra/http/errors/unauthorized-http-error';
import UseCaseService from '@/shared/use-cases/use-case-service';

import RefreshTokenRepository from '../../repositories/refresh-token-repository';

@injectable()
class AccessTokenUseCase implements UseCaseService<string, string> {
  constructor(
    @inject('RefreshTokenRepository')
    private refreshTokenRepository: RefreshTokenRepository,

    @inject('TokenProvider')
    private tokenProvider: TokenProvider,
  ) {}

  async execute(refreshToken: string): Promise<string> {
    const existsRefreshToken = await this.refreshTokenRepository.findUnique(refreshToken);

    if (!existsRefreshToken) {
      throw new BadRequestHTTPError('Invalid refresh token');
    }

    const isRefreshTokenExpired = existsRefreshToken.expiresIn.getTime() < Date.now();

    if (isRefreshTokenExpired) {
      this.refreshTokenRepository.delete(refreshToken);

      throw new UnauthorizedHTTPError('Refresh token is expired');
    }

    const accessToken = this.tokenProvider.generate({
      subject: existsRefreshToken.userId,
      expiresIn: '15m',
    });

    return accessToken;
  }
}

export default AccessTokenUseCase;
