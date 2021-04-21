import { FunctionStage } from "./FunctionStage";

/** State machine for to retain transitions and data changes */
export class StateMachine<T> {
  // Data which we will be saving after each passing function
  public StateData: T;

  // hiding so last routine"s index can"t be messed up
  private endIndex = 0;
  // hiding so routine"s index can"t be messed up
  private currentIndex = 0;
  // hiding to have immutable history data
  private data: T[] = [];
  // map between routine index and function stage list"s array index
  private stageMap: { [routineIndex: number]: number } = {};

  /**
   * Starts recursive routine which will call functions from provided list from passed context (order is important, read parameter description)
   * @param dataType data state type
   * @param functionStageList list of functions (FIRST! in list will be called FIRST, and last will be considered last (it will reset to initial state), otherwise order inconsequential)
   * @param context passing context from which a function should be called
   * @param Debug If enabled will log stages
   * @param resetFunction if not null this function will interrupt at any stage and start stage based on what it returns (you can reset to initial state)
   */
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
  constructor(private dataType: new () => T, private functionStageList: FunctionStage[], private context: any, public Debug = false, private resetFunction: FunctionStage = null) {
    if (functionStageList?.length == 0) {
      console.warn("Function stage list is empty");
      return;
    }

    // taking first function as starting point
    this.currentIndex = this.functionStageList[0].Index;
    this.endIndex = this.functionStageList[this.functionStageList.length - 1].Index;

    // prepare map once
    for (let i = 0; i < this.functionStageList.length; i++) {
      this.stageMap[this.functionStageList[i].Index] = i;
    }

    this.StateData = new this.dataType();

    this.startRecursiveRoutine();
  }

  /** A function which is called after each stage, but can be called manually */
  public SaveStateData(): void {
    this.data.push(Object.assign<T, T>(new this.dataType(), this.StateData));
  }

  /**
   * Retruns all states
   * @returns array of data state
   */
  public StateDataHistory(): T[] {
    return Object.assign<T[], T[]>([], this.data);
  }

  /** start routine which is responsible for transitions; calls itself when it"s finnished */
  private async startRecursiveRoutine(): Promise<void> {
    let work = true, index: number;

    while (work) {

      index = this.stageMap[this.currentIndex];

      if (this.Debug)
        console.log(this.functionStageList[index].FunctionReference);

      if (this.currentIndex == this.endIndex)
        work = false;

      if (this.resetFunction) {
        this.currentIndex = await Promise.race([
          this.functionStageList[index].FunctionReference.bind(this.context)(),
          this.resetFunction.FunctionReference.bind(this.context)()
        ]);
      } else {
        this.currentIndex = await this.functionStageList[index].FunctionReference.bind(this.context)();
      }

      this.SaveStateData();
    }

    this.data = [];
    this.currentIndex = this.functionStageList[0].Index;
    this.startRecursiveRoutine();
  }
}
