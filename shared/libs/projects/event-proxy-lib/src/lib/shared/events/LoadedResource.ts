import { uEventsIds, uEvent } from '../models/event';
import { ResourceSheme } from "./helpers/ResourceSheme";

/**
 * Request to load resources class which is used as a model
 * for event for loading resources like scripts or links
 */
export class LoadedResource extends uEvent {
    EventId = uEventsIds.LoadedResource;

    /**
     * Creates an instance of request to load scripts.
     * @param RequestEventId event id which requested the load
     * @param ResourceSchemes 
     */
    constructor(
        public ResourceEventId: number,
        public ResourceScheme: ResourceSheme
    )
    { super(); }
}