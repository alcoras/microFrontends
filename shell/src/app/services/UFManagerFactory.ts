import { UFManagerService } from './UFManagerService';

/**
 * Ufmanagers factory for UFManagerComponent to ensure Init is launched
 * @param provider - UFManagerComponent
 * @returns Promise
 */
export function UFManagerServiceFactory(provider: UFManagerService): Promise<void> {
  return new Promise( (resolve) => {
    provider.InitAsync().then( () => {
      provider.InitializeConnectionWithBackend();
      resolve();
    })
  })
}
