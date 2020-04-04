import { PersonnelComponent } from './personnel.component';

export function PersonnelComponentFactory(provider: PersonnelComponent) {
  return new Promise( (res) => {
    provider.InitAsync();
    res();
  });
}
