import { WunderMobilityService } from './WunderMobilityService';

/**
 * Service factory used to prepare event-proxy-lib interface before connecting
 * @param provider Class/Service/Component to create
 * @returns Promise
 */
export function WunderMobilityFactory(provider: WunderMobilityService): Promise<void> {
  return new Promise( (res) => {
    provider.InitAsync().then( () => {
      provider.InitializeConnectionWithBackend();
      res();
    });
  });
}
