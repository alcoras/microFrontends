import { MaterialReceiptsService } from './MaterialReceiptsService';

/**
 * Service factory
 * @param provider Class/Service/Component to create
 * @returns Promise
 */
export function MaterialReceiptsInitializeFactory(provider: MaterialReceiptsService): Promise<void> {
  return new Promise( (res) => {
    provider.InitAsync().then( () => {
      provider.StartQNA();
      res();
    });
  });
}
