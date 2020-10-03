import { MenuService } from './menu.service';

/**
 * Service factory
 * @param provider Class/Service/Component to create
 * @returns Promise
 */
export function MenuServiceFactory(provider: MenuService): Promise<void> {
  return new Promise( (res) => {
    provider.InitAsync().then( () => {
      provider.InitializeConnectionWithBackend();
      res();
    });
  });
}
