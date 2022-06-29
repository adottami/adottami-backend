import { container } from 'tsyringe';

import UserRepository from '@/modules/repositories/user-repository';
import PrismaUserRepository from '@/modules/users/infra/prisma/repositories/prisma-user-repository';

export function registerRepositorySingletons() {
  container.registerSingleton<UserRepository>('UserRepository', PrismaUserRepository);
}
