import UserRepositoryMock from '@/modules/repositories/mocks/user-repository-mock';

import CreateUserUseCase from '../create-user-use-case';

describe('Create user controller', () => {
  const userRepository = new UserRepositoryMock();

  it('should ...', () => {
    const useCase = new CreateUserUseCase(userRepository); // eslint-disable-line @typescript-eslint/no-unused-vars
    // ...
  });
});
