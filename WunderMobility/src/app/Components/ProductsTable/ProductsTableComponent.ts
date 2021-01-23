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

  public RefreshTable(): void {
    this.queryProducts();
  }

  public SaveNewProduct(): void {
    this.NewProductDialog = false;
    this.wunderMobilityApi.ProductCreate(this.NewProduct)
    .toPromise()
    .then(() => this.RefreshTable());
  }

  public DeleteProduct(data: WunderMobilityProduct): void {
    this.wunderMobilityApi.ProductDelete([data.Id])
    .toPromise()
    .then(() => this.RefreshTable());
  }

  public LazyLoad(event: LazyLoadEvent): void {
    console.log(event);
    this.queryProducts();
  }

  private queryProducts(): void {
    this.Loading = true;

    this.wunderMobilityApi.ProductsQuery()
    .then( (data: WunderMobilityProductQueryResults) => {
      this.Data = data.DataList;
      this.TotalRecords = data.TotalRecordsAmount;
      this.Loading = false;
    })
  }
}
