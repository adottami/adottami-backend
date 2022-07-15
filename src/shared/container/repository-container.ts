import { container } from 'tsyringe';

import PrismaCharacteristicRepository from '@/modules/publications/infra/prisma/repositories/prisma-characteristic-repository';
import CharacteristicRepository from '@/modules/publications/repositories/characteristic-repository';
import PrismaRefreshTokenRepository from '@/modules/sessions/infra/prisma/repositories/prisma-refresh-token-repository';
import RefreshTokenRepository from '@/modules/sessions/repositories/refresh-token-repository';
import PrismaUserRepository from '@/modules/users/infra/prisma/repositories/prisma-user-repository';
import UserRepository from '@/modules/users/repositories/user-repository';

export function registerRepositorySingletons() {
  container.registerSingleton<UserRepository>('UserRepository', PrismaUserRepository);
  container.registerSingleton<CharacteristicRepository>('CharacteristicRepository', PrismaCharacteristicRepository);
  container.registerSingleton<RefreshTokenRepository>('RefreshTokenRepository', PrismaRefreshTokenRepository);
}
