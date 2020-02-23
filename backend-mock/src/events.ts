export class uEvent
{
    public EventId: number = 0;
    public SourceEventUniqueId: number = 0;
    public SourceId: string = "";
    public AggregateId: number = 0;
    public SourceName: string = "";
    public EventLevel: number = 0;
    public UserID: number = 0; 
    public SessionID: string = "";
    public ParentID: number = 0;
    public ProtocolVersion: string = "";
    public Comment: string = "";
}

export class uParts
{
  static FrontendShell:number = 1000;
  static Menu:number = 1001;
  static Personnel:number = 1002;
  static Occupations:number = 1003;
  static ScriptLoader:number = 1004;
}

export class uEventsIds
{
  static InitEvent = 1000;
  static PerssonelButtonPressed = 1001;
  static OccupationButtonPressed = 1002;
  static RequestToLoadScript = 1003;
  static LoadedScript = 1004;

  static SubscribeToEvent = 2002;
}

export class uSource 
{
    public trace:{ [id:number] : any } = {}
    public subEvents:{ [id:number] : any } = {}

    public subList:number[] = [];

    public addEvent(event:any): boolean
    {
        if (!this.trace.hasOwnProperty(event.SourceEventUniqueId))
        {
            this.trace[event.SourceEventUniqueId] = event;

            return true;
        }

        return false;
    }

    public addSubEvent(event: any)
    {
        if (!this.subEvents.hasOwnProperty(event.SourceEventUniqueId))
        {
            this.subEvents[event.SourceEventUniqueId] = event;

            return true;
        }

        return false;
    }

    public getEventsFrom(traceId:number):any[]
    {
        var ret:any[] = [];
        for (let key in this.subEvents)
        {
            let value = this.subEvents[key];

            if (this.subEvents[key].SourceEventUniqueId > traceId)
            {
                ret.push(value);
            }
        }
        if (ret.length>0)
            return ret;
        else 
            return null;
    }

    public confirmEvents(list:number[], reset?:boolean):number[]
    {
        if (reset)
        {
            this.subEvents = {};
            return [0];
        }

        var keysToRemove:number[] = [];
        for (let key in this.subEvents)
        {
            if (list.includes(this.subEvents[key].AggregateId))
            {
                keysToRemove.push(+key);
            }
        }

        keysToRemove.forEach(element => 
        {
            delete this.subEvents[element];
        });

        return keysToRemove;
    }
}

export class eventDB 
{
    private aggrId:number = 1;
    public allEvents:{ [id:number] : any } = {}
    
    public source:{ [id:string] : uSource } = {}
    private sourceList:number[] = [];

    public confirmEvents(srcId:string, list?:number[], reset?:boolean)
    {
        if (this.source.hasOwnProperty(srcId))
            return this.source[srcId].confirmEvents(list, reset);
        else 
            return;
    }

    public getEventsFrom(srcId:string, traceId: number): any[]
    {
        if (this.source.hasOwnProperty(srcId))
            return this.source[srcId].getEventsFrom(traceId);
        else 
            return;
    }

    public checkForSubs(event:any)
    {
        this.sourceList.forEach(element => 
        {
            if (this.source[element].subList.includes(event.EventId))
            {
                this.source[element].addSubEvent(event);
            }   
        });
    }

    public addUniqueEvent(event:any): boolean
    {
        event.AggregateId = this.aggrId;
        if (!this.source.hasOwnProperty(event.SourceId))
        {
            this.source[event.SourceId] = new uSource();
            this.sourceList.push(event.SourceId);
        }

        if (this.source[event.SourceId].addEvent(event))
        {
            if (event.EventId == uEventsIds.SubscribeToEvent)
            {
                event.IdsTripleList.forEach((element: number[]) => 
                {
                    this.source[event.SourceId].subList.push(element[0]);
                });
            }
            this.allEvents[this.aggrId++] = event;
            this.checkForSubs(event);

            return true;
        }

        return false;
    }
}

