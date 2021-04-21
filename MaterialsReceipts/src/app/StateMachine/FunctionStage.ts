export interface FunctionStage {
    // funtion"s index, used for transitions
    Index: number;
    // reference to function: no params, returns next function"s (which will be called) index (type: number)
    FunctionReference: () => Promise<number>;
}
