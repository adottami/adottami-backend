import User from '@/modules/users/entities/user';
import UserRepositoryMock from '@/modules/users/repositories/mocks/user-repository-mock';
import UserRepository from '@/modules/users/repositories/user-repository';
import HashProvider from '@/shared/container/providers/hash-provider/hash-provider';
import HashProviderMock from '@/shared/container/providers/hash-provider/mocks/hash-provider-mock';
import BadRequestHTTPError from '@/shared/infra/http/errors/bad-request-http-error';

import UpdateUserPasswordUseCase from '../update-user-password-case';

describe('Update user password use case', () => {
  let userRepository: UserRepository;
  let hashProvider: HashProvider;
  let useCase: UpdateUserPasswordUseCase;

  beforeEach(() => {
    userRepository = new UserRepositoryMock();
    hashProvider = new HashProviderMock();
    useCase = new UpdateUserPasswordUseCase(userRepository, hashProvider);
  });

  it('should not be able to update password an uncreated user', async () => {
    const updatePasswordData = {
      id: 'ABC123',
      currentPassword: 'testpassword',
      newPassword: 'testpassword2',
    };

    await expect(useCase.execute(updatePasswordData)).rejects.toEqual(new BadRequestHTTPError('User does not exists'));
  });

  it('should not be able to update password if current password typed is wrong', async () => {
    const userData = User.create({
      name: 'Test name',
      email: 'test@test.com.br',
      password: '1234',
      phoneNumber: '123456789',
    });

    const userCreated = await userRepository.create(userData);

    const updatePasswordData = {
      id: userCreated.id,
      currentPassword: '123',
      newPassword: '12345',
    };

    await expect(useCase.execute(updatePasswordData)).rejects.toEqual(
      new BadRequestHTTPError('Current password is invalid'),
    );
  });
});
