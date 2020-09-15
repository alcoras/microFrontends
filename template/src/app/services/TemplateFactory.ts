import { <project_name>Service } from './<project_name>Service';

/**
 * Service factory used to prepare event-proxy-lib interface before connecting
 * @param provider Class/Service/Component to create
 * @returns Promise
 */
export function ServiceFactory(provider: <project_name>Service): Promise<void> {
  return new Promise( (res) => {
    provider.InitAsync().then( () => {
      provider.InitializeConnectionWithBackend();
      res();
    });
  });
}
