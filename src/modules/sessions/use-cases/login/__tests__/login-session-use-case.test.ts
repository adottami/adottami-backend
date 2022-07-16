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

import LoginSessionUseCase from '../login-session-use-case';

describe('Login session use case', () => {
  let userRepository: UserRepository;
  let refreshTokenRepository: RefreshTokenRepository;
  let hashProvider: HashProvider;
  let tokenProvider: TokenProvider;
  let useCase: LoginSessionUseCase;

  beforeEach(async () => {
    userRepository = new UserRepositoryMock();
    refreshTokenRepository = new RefreshTokenRepositoryMock();

    hashProvider = new HashProviderMock();
    tokenProvider = new TokenProviderMock();
    useCase = new LoginSessionUseCase(userRepository, refreshTokenRepository, hashProvider, tokenProvider);

    const password = '1234';
    const hashedPassword = await hashProvider.generate(password);

    const userData = User.create({
      name: 'Test name',
      email: 'test@test.com.br',
      password: hashedPassword,
      phoneNumber: '123456789',
    });

    await userRepository.create(userData);
  });

  it('should be able to generate a token and a refresh token for the user to login', async () => {
    const loginData = {
      email: 'test@test.com.br',
      password: '1234',
    };

    const { user, token, refreshToken } = await useCase.execute(loginData);

    expect(user).toHaveProperty('id');
    expect(user).toHaveProperty('name');
    expect(user).toHaveProperty('email');
    expect(user).toHaveProperty('phoneNumber');
    expect(user).toHaveProperty('createdAt');
    expect(user).toHaveProperty('password');
    expect(user.email).toBe(loginData.email);

    expect(token).not.toBeNaN();
    expect(token).not.toBeNull();
    expect(token).not.toBeUndefined();
    expect(token).not.toBe('');
    expect(token).toMatch(/./);
    expect(token.length).toBeGreaterThanOrEqual(1);

    expect(refreshToken).not.toBeNaN();
    expect(refreshToken).not.toBeNull();
    expect(refreshToken).not.toBeUndefined();
    expect(refreshToken).not.toBe('');
    expect(refreshToken.length).toBeGreaterThanOrEqual(1);
  });

  it('should not be able to login without a created account', async () => {
    const loginData = {
      email: 'test1@test.com.br',
      password: '12345',
    };

    await expect(useCase.execute(loginData)).rejects.toEqual(new BadRequestHTTPError('Email or password incorrect'));
  });

  it('should not be able to login by incorrect email', async () => {
    const loginData = {
      email: 'test2@test.com.br',
      password: '1234',
    };

    await expect(useCase.execute(loginData)).rejects.toEqual(new BadRequestHTTPError('Email or password incorrect'));
  });

  it('should not be able to login by incorrect email', async () => {
    const loginData = {
      email: 'test@test.com.br',
      password: '12345',
    };

    await expect(useCase.execute(loginData)).rejects.toEqual(new BadRequestHTTPError('Email or password incorrect'));
  });
});
