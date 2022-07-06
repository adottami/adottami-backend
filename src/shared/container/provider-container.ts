import { container } from 'tsyringe';

import HashProvider from '@/shared/container/providers/hash-provider/hash-provider';
import BcryptHashProvider from '@/shared/container/providers/hash-provider/implementations/bcrypt-hash-provider/bcrypt-hash-provider';
import JWTTokenProvider from '@/shared/container/providers/token-provider/implementations/jwt-token-provider';
import { TokenProvider } from '@/shared/container/providers/token-provider/token-provider';

export function registerProviderSingletons() {
  container.registerSingleton<HashProvider>('HashProvider', BcryptHashProvider);
  container.registerSingleton<TokenProvider>('TokenProvider', JWTTokenProvider);
}
