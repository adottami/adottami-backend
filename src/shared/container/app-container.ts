import { registerProviderSingletons } from './provider-container';
import { registerRepositorySingletons } from './repository-container';

export function registerAppSingletons() {
  registerRepositorySingletons();
  registerProviderSingletons();
}
