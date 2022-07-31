import RefreshTokenRepositoryMock from '@/modules/sessions/repositories/mocks/refresh-token-repository-mock';
import RefreshTokenRepository from '@/modules/sessions/repositories/refresh-token-repository';
import User from '@/modules/users/entities/user';
import UserRepositoryMock from '@/modules/users/repositories/mocks/user-repository-mock';
import UserRepository from '@/modules/users/repositories/user-repository';
import HashProvider from '@/shared/container/providers/hash-provider/hash-provider';
import HashProviderMock from '@/shared/container/providers/hash-provider/mocks/hash-provider-mock';
import BadRequestHTTPError from '@/shared/infra/http/errors/bad-request-http-error';

import LogoutSessionUseCase from '../logout-session-use-case';

describe('Access token use case', () => {
  let userRepository: UserRepository;
  let refreshTokenRepository: RefreshTokenRepository;
  let hashProvider: HashProvider;
  let useCase: LogoutSessionUseCase;
  let user: User;

  beforeEach(async () => {
    userRepository = new UserRepositoryMock();
    refreshTokenRepository = new RefreshTokenRepositoryMock();
    hashProvider = new HashProviderMock();

    useCase = new LogoutSessionUseCase(userRepository, refreshTokenRepository);

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

  it('should be able to delete all refresh tokens at logout', async () => {
    const refreshTokenExpiration = new Date();
    refreshTokenExpiration.setMinutes(refreshTokenExpiration.getMinutes() + 10);

    const refreshToken1 = await refreshTokenRepository.create(user.id, refreshTokenExpiration);
    const refreshToken2 = await refreshTokenRepository.create(user.id, refreshTokenExpiration);

    await useCase.execute(user.id);

    expect(await refreshTokenRepository.findUnique(refreshToken1.id)).toBeNull();
    expect(await refreshTokenRepository.findUnique(refreshToken2.id)).toBeNull();
  });

  it('should not be able to logout with invalid user id', async () => {
    const userId = '12345';

    await expect(useCase.execute(userId)).rejects.toEqual(new BadRequestHTTPError('User not found'));
  });
});
