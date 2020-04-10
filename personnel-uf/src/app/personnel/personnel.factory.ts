import { PersonnelComponent } from './personnel.component';

/**
 * Personnels component factory
 * @param provider Class to create
 * @returns Promise
 */
export function PersonnelComponentFactory(provider: PersonnelComponent) {
  return new Promise( (res) => {
    provider.InitAsync();
    provider.StartQNA();
    res();
  });
}
