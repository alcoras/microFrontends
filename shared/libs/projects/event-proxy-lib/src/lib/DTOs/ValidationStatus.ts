export class ValidationStatus<T> {
  public Result: T;
  public ErrorList: string[] = [];

  public HasErrors(): boolean {
    return this.ErrorList.length > 0;
  }
}
