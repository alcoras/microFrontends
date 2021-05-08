import { Component } from "@angular/core";
import { MaterialsReceiptsAPI } from "@shared/services/MaterialsReceiptsAPI";
import { LazyLoadEvent } from "primeng/api";
import { InventoryManagerAggregate } from "@shared/Adds/InventoryManagerAggregate";

@Component({
  selector: "materials-receipts-inventory-manager",
  templateUrl: "./InventoryManagerView.html",
})
export class InventoryManagerComponent {
	public Loading: boolean;
	public TotalRecords: number;

	public inventoryManagerData: InventoryManagerAggregate[];

	public Columns = [
		{ field: "ElementId", header: "ElementId"},
  	{ field: "Name", header: "Name"},
  	{ field: "Comment", header: "Comment"},
  	{ field: "BarCode", header: "BarCode"},
  	{ field: "Sum", header: "Sum"},
	];

	private inventoryMap = new Map<number, number>();

	constructor(private materialsReceiptsAPI: MaterialsReceiptsAPI) {
		this.Loading = true;
	}

	public async LazyDataLoad(event: LazyLoadEvent): Promise<void> {
		const page = event.first/event.rows + 1;
		const limit = event.rows;

		await this.refreshInventoryManagerAsync(page, limit);
	}

	public async RefreshTable(): Promise<void> {
		await this.refreshInventoryManagerAsync();
	}

	private async refreshInventoryManagerAsync(page = 1, limit = 30): Promise<void> {
		this.Loading = true;

		const inventoryResponse = await this.materialsReceiptsAPI.InventoryManagerQueryAsync();

		if (inventoryResponse.HasErrors()) {
			this.Loading = false;
			throw new Error(inventoryResponse.ErrorList.toString());
		}

		this.TotalRecords = inventoryResponse.Result.TotalRecordsAmount;
		this.inventoryManagerData = inventoryResponse.Result.ResultList;

		let materialIdList: number[] = [];
		for (let i = 0; i < inventoryResponse.Result.ResultList.length; i++) {
			const entry = inventoryResponse.Result.ResultList[i];
			this.inventoryMap.set(entry.ElementId, i);
			materialIdList.push(entry.ElementId);
		}

		const materialsResponse = await this.materialsReceiptsAPI.MaterialsQueryByListAsync(materialIdList);

		if (materialsResponse.HasErrors()) {
			this.Loading = false;
			throw new Error(materialsResponse.ErrorList.toString());
		}

		for (let i = 0; i < materialsResponse.Result.MaterialsDataList.length; i++) {
			const entry = materialsResponse.Result.MaterialsDataList[i];
			const key = this.inventoryMap.get(entry.Id);
			this.inventoryManagerData[key].BarCode = entry.BarCode;
			this.inventoryManagerData[key].Comment = entry.Comment;
			this.inventoryManagerData[key].Name = entry.Name;
		}

		this.Loading = false;
	}

}
