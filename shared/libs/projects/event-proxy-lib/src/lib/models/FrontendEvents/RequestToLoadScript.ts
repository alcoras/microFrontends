import { CoreEvent } from '../CoreEvent';
import { EventIds } from '../EventIds';
import { ResourceSheme } from './helpers/ResourceSheme';

/**
 * Request to load scripts class which is used as a model
 * for event for loading resources
 */
export class RequestToLoadScripts extends CoreEvent {
    /**
     * Creates an instance of request to load scripts.
     * @param RequestEventId event id which requested the load
     * @param ResourceSchemes scheme with data about HTML element to be loaded
     */
    public constructor(
        public RequestEventId: number,
        public ResourceSchemes: ResourceSheme[]
    ) {
      super();
      this.EventId = EventIds.RequestToLoadScript;
    }
}
