class uEvent
{
  constructor(
    public eventID:number,
    public srcID:number,
    public destID:number[]
  ) {}
}

export class uEventTemplate
{
  constructor(
    public eventID: number,
    public traceID: number,
    public eventType: number,
    public srcID: number,
    public destID: number[],
    public parentID?: number) {}
}

export class uParts
{
  static FrontendShell:number = 1000;
  static Menu:number = 1001;
  static Personnel:number = 1002;
  static Occupations:number = 1003;
  static ScriptLoader:number = 1004;
}

export class uEvents
{
  static PerssonelButtonPressed:uEvent = new uEvent(1000, uParts.Menu, [uParts.Personnel, uParts.ScriptLoader]);
}

