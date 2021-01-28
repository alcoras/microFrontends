import { Component } from "@angular/core";
import { WunderMobilityProduct, WunderMobilityProductQueryResults } from "event-proxy-lib-src";
import { LazyLoadEvent } from "primeng/api";
import { WunderMobilityAPI } from "src/app/Services/WunderMobilityAPI";

@Component({
  templateUrl: "ProductsTableView.html",
  selector: "wunder-mobility-products-table"
}) export class ProductsTableComponent {
  public Data: WunderMobilityProduct[];

  public Loading: boolean;
  public TotalRecords: number;

  public NewProduct: WunderMobilityProduct = new WunderMobilityProduct();
  public NewProductDialog = false;

  public Columns = [ "ProductCode", "Name", "Price", "PromotionalQuantity", "PromotionalPrice"];

  public constructor(private wunderMobilityApi: WunderMobilityAPI) {
    this.Loading = true;
  }

  public CreateNewProduct(): void {
    this.NewProduct = new WunderMobilityProduct();
    this.NewProductDialog = true;
  }

  public async RefreshTable(): Promise<void> {
    await this.queryProductsAsync();
  }

  public SaveNewProduct(): void {
    this.NewProductDialog = false;
    this.wunderMobilityApi.ProductCreateAsync(this.NewProduct)
    .then(() => this.RefreshTable());
  }

  public DeleteProduct(data: WunderMobilityProduct): void {
    this.wunderMobilityApi.ProductDeleteAsync([data.Id])
    .then(() => this.RefreshTable());
  }

  public async LazyLoad(event: LazyLoadEvent): Promise<void> {
    await this.queryProductsAsync();
  }

  private async queryProductsAsync(): Promise<void> {
    this.Loading = true;

    const response = await this.wunderMobilityApi.ProductsQueryAsync();

    this.Data = response.Result.DataList;
    this.TotalRecords = response.Result.TotalRecordsAmount;

    this.Loading = false;
  }
}
