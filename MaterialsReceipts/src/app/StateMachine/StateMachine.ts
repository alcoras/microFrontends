import { FunctionStage } from "./FunctionStage";

/** State machine for to retain transitions and data changes */
export class StateMachine<T> {

  // Data which we will be saving after each passing function
  public StateData: T;

  // hiding so last routine's index can't be messed up
  private endIndex = 0;
  // hiding so routine's index can't be messed up
  private currentIndex = 0;
  // hiding to have immutable history data
  private data: T[] = [];
  // map between routine index and function stage list's array index
  private stageMap: { [routineIndex: number]: number } = {};

  /**
   * Starts recursive routine will call functions from provided list from passed context
   * @param dataType data state type
   * @param functionStageList list of functions (first in list will be called first, and last will be considered last, otherwise order inconsequential)
   * @param context passing context from which a function should be called
   */
  constructor(private dataType: new () => T, private functionStageList: FunctionStage[], private context: any) {
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
    this.data.push(Object.assign({}, this.StateData));
  }

  /** Get all data's states */
  public StateDataHistory(): T[] {
    return Object.assign({}, this.data);
  }

  /** start routine which is responsible for transitions; calls itself when it's finnished */
  private async startRecursiveRoutine(): Promise<void> {
    let work = true, index: number; 

    while (work) {
      index = this.stageMap[this.currentIndex];

      if (this.currentIndex == this.endIndex)
        work = false;

      this.currentIndex = await this.functionStageList[index].FunctionReference.bind(this.context)();
      this.SaveStateData();
    }

    this.currentIndex = this.functionStageList[0].Index;
    this.startRecursiveRoutine();
  }
}