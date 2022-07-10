import User from '@/modules/users/entities/user';
import UserRepositoryMock from '@/modules/users/repositories/mocks/user-repository-mock';
import UserRepository from '@/modules/users/repositories/user-repository';
import NotFoundHTTPError from '@/shared/infra/http/errors/not-found-http-error';

import GetUserUseCase from '../get-user-use-case';

describe('Get user use case', () => {
  let userRepository: UserRepository;
  let useCase: GetUserUseCase;

  beforeEach(() => {
    userRepository = new UserRepositoryMock();
    useCase = new GetUserUseCase(userRepository);
  });

  it('should be able to get a user created', async () => {
    const userData = User.create({
      name: 'Test name',
      email: 'test@test.com.br',
      password: '1234',
      phoneNumber: '123456789',
    });

    const userCreated = await userRepository.create(userData);

    const user = await useCase.execute(userCreated.id);

    expect(user).toBeInstanceOf(User);
    expect(user).toHaveProperty('id');
    expect(user).toHaveProperty('createdAt');
    expect(user.name).toBe(userData.name);
    expect(user.email).toBe(userData.email);
    expect(user.password).toBe(userData.password);
    expect(user.phoneNumber).toBe(userData.phoneNumber);
  });

  it('should not be able to get an uncreated user', async () => {
    const testId = 'ABC123';

    await expect(useCase.execute(testId)).rejects.toEqual(new NotFoundHTTPError('User does not exists'));
  });
});
