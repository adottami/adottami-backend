import { container } from 'tsyringe';

import PrismaCharacteristicRepository from '@/modules/publications/infra/prisma/repositories/prisma-characteristic-repository';
import CharacteristicRepository from '@/modules/publications/repositories/characteristic-repository';
import PrismaUserRepository from '@/modules/users/infra/prisma/repositories/prisma-user-repository';
import UserRepository from '@/modules/users/repositories/user-repository';

export function registerRepositorySingletons() {
  container.registerSingleton<UserRepository>('UserRepository', PrismaUserRepository);
  container.registerSingleton<CharacteristicRepository>('CharacteristicRepository', PrismaCharacteristicRepository);
}
