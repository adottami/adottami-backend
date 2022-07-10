import { container } from 'tsyringe';

import PrismaUserRepository from '@/modules/users/infra/prisma/repositories/prisma-user-repository';
import UserRepository from '@/modules/users/repositories/user-repository';

export function registerRepositorySingletons() {
  container.registerSingleton<UserRepository>('UserRepository', PrismaUserRepository);
}
