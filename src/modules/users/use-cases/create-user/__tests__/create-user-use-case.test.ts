import PrismaUserRepositoryMock from '@/modules/users/infra/prisma/repositories/mocks/prisma-user-repository-mock';

import CreateUserUseCase from '../create-user-use-case';

describe('Create user controller', () => {
  const userRepository = new PrismaUserRepositoryMock();

  it('should ...', () => {
    const useCase = new CreateUserUseCase(userRepository); // eslint-disable-line @typescript-eslint/no-unused-vars
    // ...
  });
});
