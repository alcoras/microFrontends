import { OccupationService } from './Occupation.service';

/**
 * Service factory
 * @param provider Class/Service/Component to create
 * @returns Promise
 */
export function OccupationServiceFactory(provider: OccupationService): Promise<void> {
  return new Promise( (res) => {
    provider.InitAsync().then( () => {
      provider.StartQNA();
      res();
    });
  });
}
