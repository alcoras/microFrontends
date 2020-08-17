import { UFManagerComponent } from './uf-manager.component';

/**
 * Ufmanagers factory for UFManagerComponent to ensure Init is launched
 * @param provider - UFManagerComponent
 * @returns Promise
 */
export function UFManagerFactory(provider: UFManagerComponent): Promise<void> {
  return new Promise( (resolve) => {
    provider.InitAsync().then( () => {provider.StartQNA(); resolve(); })
  })
}
