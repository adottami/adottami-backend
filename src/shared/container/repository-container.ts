import { container } from 'tsyringe';

import PrismaCharacteristicRepository from '@/modules/publications/infra/prisma/repositories/prisma-characteristic-repository';
import PrismaPublicationRepository from '@/modules/publications/infra/prisma/repositories/prisma-publication-repository';
import CharacteristicRepository from '@/modules/publications/repositories/characteristic-repository';
import PublicationRepository from '@/modules/repositories/publication-repository';
import PrismaRefreshTokenRepository from '@/modules/sessions/infra/prisma/repositories/prisma-refresh-token-repository';
import RefreshTokenRepository from '@/modules/sessions/repositories/refresh-token-repository';
import PrismaUserRepository from '@/modules/users/infra/prisma/repositories/prisma-user-repository';
import UserRepository from '@/modules/users/repositories/user-repository';

export function registerRepositorySingletons() {
  container.registerSingleton<UserRepository>('UserRepository', PrismaUserRepository);
  container.registerSingleton<CharacteristicRepository>('CharacteristicRepository', PrismaCharacteristicRepository);
  container.registerSingleton<RefreshTokenRepository>('RefreshTokenRepository', PrismaRefreshTokenRepository);
  container.registerSingleton<PublicationRepository>('PublicationRepository', PrismaPublicationRepository);
}
