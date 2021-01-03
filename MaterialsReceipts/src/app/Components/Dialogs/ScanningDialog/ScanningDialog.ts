import { Component } from "@angular/core";
import { ScanTableData } from "event-proxy-lib-src";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";

@Component({
  templateUrl: "ScanningDialogView.html"
}) export class ScanningDialog {

  public Data: ScanTableData[] = [];
  public Columns = ["BarCode", "Quantity", "Unit"];

  public NewDialogVisible: boolean;
  public NewEntry = new ScanTableData();
  public Submited: false;

  public constructor(
    public dialogReference: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig) {
  }

  public RemoveEntry(data: ScanTableData): void {
    const id = this.Data.indexOf(data);
    this.Data.splice(id, 1);
  }

  public AddNewEntry(): void {
    this.NewDialogVisible = true;
    this.NewEntry = { Quantity: 1 };
    this.Submited = false;
  }

  public SaveNewEntry(): void {
    this.NewDialogVisible = false;
    this.Data.push(this.NewEntry);
  }

  public SaveNewEntryAndNext(): void {
    this.Data.push(this.NewEntry);
    this.NewEntry = {Quantity: 1};
  }

  public SaveEntries(): void {
    this.dialogReference.close(this.Data);
  }
}
