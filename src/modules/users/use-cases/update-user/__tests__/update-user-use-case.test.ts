import User from '@/modules/users/entities/user';
import UserRepositoryMock from '@/modules/users/repositories/mocks/user-repository-mock';
import UserRepository from '@/modules/users/repositories/user-repository';
import HashProvider from '@/shared/container/providers/hash-provider/hash-provider';
import HashProviderMock from '@/shared/container/providers/hash-provider/mocks/hash-provider-mock';
import BadRequestHTTPError from '@/shared/infra/http/errors/bad-request-http-error';
import NotFoundHTTPError from '@/shared/infra/http/errors/not-found-http-error';

import UpdateUserUseCase from '../update-user-use-case';

describe('Update user use case', () => {
  let userRepository: UserRepository;
  let hashProvider: HashProvider;
  let useCase: UpdateUserUseCase;

  beforeEach(() => {
    userRepository = new UserRepositoryMock();
    hashProvider = new HashProviderMock();
    useCase = new UpdateUserUseCase(userRepository);
  });

  it('should be able to update user', async () => {
    const userCreateData = User.create({
      name: 'Test name',
      email: 'test@test.com.br',
      password: '1234',
      phoneNumber: '123456789',
    });

    const userCreated = await userRepository.create(userCreateData);

    const userUpdateData = {
      name: 'New test name',
      email: 'newtest@test.com.br',
      phoneNumber: '987654321',
    };

    const userUpdated = await useCase.execute({ id: userCreated.id, ...userUpdateData });

    expect(userUpdated).toBeInstanceOf(User);
    expect(userUpdated).toHaveProperty('id');
    expect(userUpdated).toHaveProperty('createdAt');
    expect(userUpdated.id).toBe(userCreated.id);
    expect(userUpdated.name).toBe(userUpdateData.name);
    expect(userUpdated.email).toBe(userUpdateData.email);
    expect(userUpdated.password).toBe(userCreated.password);
    expect(userUpdated.phoneNumber).toEqual(userUpdateData.phoneNumber);
  });

  it('should not be able to update unregistered user', async () => {
    const userCreateData = User.create({
      name: 'Test name',
      email: 'test@test.com.br',
      password: '1234',
      phoneNumber: '123456789',
    });

    await userRepository.create(userCreateData);

    const userUpdateData = {
      name: 'New test name',
      email: 'newtest@test.com.br',
      phoneNumber: '987654321',
    };

    await expect(useCase.execute({ id: userCreateData.id, ...userUpdateData })).rejects.toEqual(
      new NotFoundHTTPError('User does not exists'),
    );
  });

  it('should not be able to update user with email already registered', async () => {
    const userCreateData1 = User.create({
      name: 'Test name 1',
      email: 'test1@test.com.br',
      password: '1234',
      phoneNumber: '123456789',
    });

    const userCreated1 = await userRepository.create(userCreateData1);

    const userCreateData2 = User.create({
      name: 'Test name 2',
      email: 'test2@test.com.br',
      password: '1044',
      phoneNumber: '987654321',
    });

    await userRepository.create(userCreateData2);

    const userUpdateData = {
      name: 'New test name',
      email: userCreateData2.email,
      phoneNumber: '111111111',
    };

    await expect(useCase.execute({ id: userCreated1.id, ...userUpdateData })).rejects.toEqual(
      new BadRequestHTTPError('E-mail already registered'),
    );
  });
});
