import { uEventsIds, uEvent } from '../models/event';

export class ResourceSheme
{
    public Element:string;
    public Attributes:{[attrName: string]: string } = {}

    public setAttribute(attr: string, value: string)
    {
        this.Attributes[attr] = value;
    }
}

export class RequestToLoadScripts extends uEvent
{
    EventId = uEventsIds.RequestToLoadScript;

    constructor(
        public RequestEventId: number,
        public ResourceSchemes: ResourceSheme[]
    )
    { super(); }
}