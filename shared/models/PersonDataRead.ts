import { IPersonnel } from './IPersonnel';
import { uEvent } from './event';

export class PersonDataRead extends uEvent {
  ListOutputEnterprisePersonData: IPersonnel[];
  ParentSourceEventUniqueId: number;
}
