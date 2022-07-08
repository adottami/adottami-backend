import { container } from 'tsyringe';

import HashProvider from '@/shared/container/providers/hash-provider/hash-provider';
import BcryptHashProvider from '@/shared/container/providers/hash-provider/implementations/bcrypt-hash-provider/bcrypt-hash-provider';

import CloudinaryStorageProvider from './providers/storage-provider/implementations/cloudinary-storage-provider/cloudinary-storage-provider';
import StorageProvider from './providers/storage-provider/storage-provider';

export function registerProviderSingletons() {
  container.registerSingleton<HashProvider>('HashProvider', BcryptHashProvider);
  container.registerSingleton<StorageProvider>('StorageProvider', CloudinaryStorageProvider);
}
