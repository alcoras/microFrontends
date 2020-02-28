import { uEventsIds, uEvent } from '../models/event';

export class UrlScheme
{
    public URL:string;
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
        public UrlSchemes: UrlScheme[]
    )
    { super(); }
}