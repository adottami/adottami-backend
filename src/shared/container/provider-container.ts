import { container } from 'tsyringe';

import globalConfig from '@/config/global-config/global-config';
import HashProvider from '@/shared/container/providers/hash-provider/hash-provider';
import BcryptHashProvider from '@/shared/container/providers/hash-provider/implementations/bcrypt-hash-provider/bcrypt-hash-provider';
import { ClassType } from '@/types/utils';

import CloudinaryStorageProvider from './providers/storage-provider/implementations/cloudinary-storage-provider/cloudinary-storage-provider';
import LocalStorageProvider from './providers/storage-provider/implementations/local-storage-provider/local-storage-provider';
import StorageProvider from './providers/storage-provider/storage-provider';

function getActiveStorageProvider(): ClassType<StorageProvider> {
  return globalConfig.mode() === 'production' ? CloudinaryStorageProvider : LocalStorageProvider;
}

export function registerProviderSingletons() {
  container.registerSingleton<HashProvider>('HashProvider', BcryptHashProvider);
  container.registerSingleton<StorageProvider>('StorageProvider', getActiveStorageProvider());
}
