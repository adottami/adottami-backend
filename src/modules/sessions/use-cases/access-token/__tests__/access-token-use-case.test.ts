import RefreshTokenRepositoryMock from '@/modules/sessions/repositories/mocks/refresh-token-repository-mock';
import RefreshTokenRepository from '@/modules/sessions/repositories/refresh-token-repository';
import User from '@/modules/users/entities/user';
import UserRepositoryMock from '@/modules/users/repositories/mocks/user-repository-mock';
import UserRepository from '@/modules/users/repositories/user-repository';
import HashProvider from '@/shared/container/providers/hash-provider/hash-provider';
import HashProviderMock from '@/shared/container/providers/hash-provider/mocks/hash-provider-mock';
import TokenProviderMock from '@/shared/container/providers/token-provider/mocks/token-provider-mock';
import TokenProvider from '@/shared/container/providers/token-provider/token-provider';
import BadRequestHTTPError from '@/shared/infra/http/errors/bad-request-http-error';

import AccessTokenUseCase from '../access-token-use-case';

describe('Access token use case', () => {
  let userRepository: UserRepository;
  let refreshTokenRepository: RefreshTokenRepository;
  let hashProvider: HashProvider;
  let tokenProvider: TokenProvider;
  let useCase: AccessTokenUseCase;
  let user: User;

  beforeEach(async () => {
    userRepository = new UserRepositoryMock();
    refreshTokenRepository = new RefreshTokenRepositoryMock();
    hashProvider = new HashProviderMock();
    tokenProvider = new TokenProviderMock();

    useCase = new AccessTokenUseCase(refreshTokenRepository, tokenProvider);

    const password = '1234';
    const hashedPassword = await hashProvider.generate(password);

    const userData = User.create({
      name: 'Test name',
      email: 'test@test.com.br',
      password: hashedPassword,
      phoneNumber: '123456789',
    });

    user = await userRepository.create(userData);
  });

  it('should be able to generate a new access token by refresh token', async () => {
    const refreshTokenExpiration = new Date();
    refreshTokenExpiration.setMinutes(refreshTokenExpiration.getMinutes() + 10);

    const refreshToken = await refreshTokenRepository.create(user.id, refreshTokenExpiration);

    const accessToken = await useCase.execute(refreshToken.id);

    expect(accessToken).not.toBeNaN();
    expect(accessToken).not.toBeNull();
    expect(accessToken).not.toBeUndefined();
    expect(accessToken).not.toBe('');
    expect(accessToken).toMatch(/./);
    expect(accessToken.length).toBeGreaterThanOrEqual(1);
  });

  it('should not be able to generate a new access token by nonexistent refresh token', async () => {
    const refreshToken = '123456789';

    await expect(useCase.execute(refreshToken)).rejects.toEqual(new BadRequestHTTPError('Invalid refresh token'));
  });

  it('should not be able to generate a new access token by expired refresh token', async () => {
    const refreshTokenExpiration = new Date();
    refreshTokenExpiration.setMinutes(refreshTokenExpiration.getMinutes() - 10);

    const refreshToken = await refreshTokenRepository.create(user.id, refreshTokenExpiration);

    await expect(useCase.execute(refreshToken.id)).rejects.toEqual(new BadRequestHTTPError('Refresh token is expired'));
  });
});
