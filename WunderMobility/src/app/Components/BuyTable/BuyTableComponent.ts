import { Component } from "@angular/core";
import { WunderMobilityDoCheckoutResults, WunderMobilityScannedProduct } from "event-proxy-lib-src";
import { WunderMobilityAPI } from "src/app/Services/WunderMobilityAPI";

@Component({
  templateUrl: "BuyTableView.html",
  selector: "wunder-mobility-buy-table"
}) export class BuyTableComponent {

  public ScannedProducts: WunderMobilityScannedProduct[] = [];
  public ShowTotalPriceDialog: boolean;
  public CurrentTotalPrice: number;

  public Columns = [
    { field:"ProductCode", header: "Product Code"},
    { field:"Quantity", header: "Quantity"}
  ];

  public constructor(private wunderMobilityAPI: WunderMobilityAPI) {}

  public Delete(data: WunderMobilityScannedProduct): void {
    const index = this.ScannedProducts.indexOf(data);
    this.ScannedProducts.splice(index, 1);
  }

  public Checkout(): void {
    this.wunderMobilityAPI.Checkout(this.ScannedProducts)
    .then((data: WunderMobilityDoCheckoutResults) => {
      this.ScannedProducts = [];
      this.CurrentTotalPrice = data.TotalPrice;
      this.ShowTotalPriceDialog = true;
    });
  }

  public AddNewRandomScan(): void {
    const randomId = "00" + Math.floor(Math.random() * Math.floor(3) + 1);
    let added = false;
    for (let i = 0; i < this.ScannedProducts.length; i++) {
      if (this.ScannedProducts[i].ProductCode == randomId) {
        this.ScannedProducts[i].Quantity++;
        added = true;
      }
    }

    if (!added) {
      const newProduct: WunderMobilityScannedProduct = {
        ProductCode: randomId,
        Quantity: 1
      };

      this.ScannedProducts.push(newProduct);
    }

  }
}
