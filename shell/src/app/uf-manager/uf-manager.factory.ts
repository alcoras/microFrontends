import { UFManagerComponent } from './uf-manager.component';
import { resolve } from 'url';

export function UFManagerFactory(provider: UFManagerComponent) {
  return new Promise( (res) => {
    provider.Init();
    res();
  });
}
