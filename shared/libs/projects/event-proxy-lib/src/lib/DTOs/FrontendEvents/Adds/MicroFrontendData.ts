import { ResourceSheme } from "./ResourceSheme";

/**
 * MicroFrontend Data
 */
export class MicroFrontendData {
    /**
     * Events which this microfrontend will be subscribed and by those events
     * will be loaded (if event id is hit and micro forntend is not loaded)
     */
    public events: number[] = [];

    /**
     * Resources to be loaded for this micro frontend
     */
    public resources: ResourceSheme[] = [];
}
