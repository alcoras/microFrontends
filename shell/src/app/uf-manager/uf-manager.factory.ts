import { UFManagerComponent } from './uf-manager.component';

/**
 * Ufmanagers factory for UFManagerComponent to ensure Init is launched
 * @param provider UFManagerComponent
 * @returns Promise
 */
export function UFManagerFactory(provider: UFManagerComponent) {
  return new Promise( (res) => {
    provider.Init();
    res();
  });
}
