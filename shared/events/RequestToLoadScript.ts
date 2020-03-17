import { uEventsIds, uEvent } from '../models/event';
import { ResourceSheme } from './helpers/ResourceSheme';

/**
 * Request to load scripts class which is used as a model
 * for event for loading resources
 */
export class RequestToLoadScripts extends uEvent {
    /**
     * Creates an instance of request to load scripts.
     * @param RequestEventId event id which requested the load
     * @param ResourceSchemes scheme with data about HTML element to be loaded
     */
    constructor(
        public RequestEventId: number,
        public ResourceSchemes: ResourceSheme[]
    ) {
      super();
      this.EventId = uEventsIds.RequestToLoadScript;
    }
}
