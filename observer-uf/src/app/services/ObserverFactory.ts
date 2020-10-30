import { ObserverService } from "./ObserverService";

/**
 * Service factory
 * @param provider Class/Service/Component to create
 * @returns Promise
 */
export function OccupationServiceFactory(provider: ObserverService): Promise<void> {
  return new Promise( (res) => {
    provider.InitAsync().then( () => {
      provider.InitializeConnectionWithBackend();
      res();
    });
  });
}
