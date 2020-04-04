import { UFManagerComponent } from './uf-manager.component';

export function UFManagerFactory(provider: UFManagerComponent) {
  return new Promise( (res) => {
    provider.Init();
    res();
  });
}
