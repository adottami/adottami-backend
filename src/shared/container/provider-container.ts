import { container } from 'tsyringe';

import HashProvider from '@/shared/container/providers/hash-provider/hash-provider';
import BcryptHashProvider from '@/shared/container/providers/hash-provider/implementations/bcrypt-hash-provider/bcrypt-hash-provider';

export function registerProviderSingletons() {
  container.registerSingleton<HashProvider>('HashProvider', BcryptHashProvider);
}
