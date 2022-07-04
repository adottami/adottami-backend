import UserRepositoryMock from '@/modules/repositories/mocks/user-repository-mock';
import UserRepository from '@/modules/repositories/user-repository';
import User from '@/modules/users/entities/user';
import HashProvider from '@/shared/container/providers/hash-provider/hash-provider';
import HashProviderMock from '@/shared/container/providers/hash-provider/mocks/hash-provider-mock';
import BadRequestHTTPError from '@/shared/infra/http/errors/bad-request-http-error';

import CreateUserUseCase from '../create-user-use-case';

describe('Create user use case', () => {
  let userRepository: UserRepository;
  let hashProvider: HashProvider;
  let useCase: CreateUserUseCase;

  beforeEach(() => {
    userRepository = new UserRepositoryMock();
    hashProvider = new HashProviderMock();
    useCase = new CreateUserUseCase(userRepository, hashProvider);
  });

  it('should be able to create a new user', async () => {
    const userData = {
      name: 'Test name',
      email: 'test@test.com.br',
      password: '1234',
      phoneNumber: '123456789',
    };

    const user = await useCase.execute(userData);

    expect(user).toBeInstanceOf(User);
    expect(user).toHaveProperty('id');
    expect(user).toHaveProperty('createdAt');
    expect(user.name).toBe(userData.name);
    expect(user.email).toBe(userData.email);
    expect(user.password).not.toBe(userData.password);
    expect(user.phoneNumber).toBe(userData.phoneNumber);
  });

  it('should be able to create a new user with encrypted password', async () => {
    const userData = {
      name: 'Test name',
      email: 'test@test.com.br',
      password: '1234',
      phoneNumber: '123456789',
    };

    const user = await useCase.execute(userData);

    const samePasswords = await hashProvider.compare(userData.password, user.password);

    expect(userData.password === user.password).toBeFalsy();
    expect(samePasswords).toBeTruthy();
  });

  it('should not be able to create a new user with email already registered', async () => {
    const userData1 = {
      name: 'Test name 1',
      email: 'test@test.com.br',
      password: '1234',
      phoneNumber: '123456789',
    };

    const userData2 = {
      name: 'Test name 2',
      email: userData1.email,
      password: '1288',
      phoneNumber: '123456789',
    };

    await useCase.execute(userData1);

    await expect(useCase.execute(userData2)).rejects.toEqual(new BadRequestHTTPError('User already exists'));
  });
});
