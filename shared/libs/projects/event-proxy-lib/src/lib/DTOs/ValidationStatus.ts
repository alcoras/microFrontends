export class ValidationStatus<T> {
  public Result: T;
  public ErrorList: string[] = [];

  public HasErrors(): boolean {
    return this.ErrorList.length > 0;
  }

  public CombineErrors(validationStatus: ValidationStatus<T>) {
    for (let i = 0; i < validationStatus.ErrorList.length; i++)
      this.ErrorList.push(validationStatus.ErrorList[i]);
  }
}
