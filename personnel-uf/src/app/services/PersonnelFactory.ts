import { PersonnelService } from './PersonnelService';

/**
 * Personnels component factory
 * @param provider Class to create
 * @returns Promise
 */
export function PersonnelServiceFactory(provider: PersonnelService): Promise<void> {
  return new Promise( (res) => {
    provider.InitAsync().then( () => {
      provider.InitializeConnectionWithBackend();
      res();
    });
  });
}
