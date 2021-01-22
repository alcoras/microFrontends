import { Component } from "@angular/core";

interface ScannedProduct {
  ProductCode: number;
  Quantity: number;
}

@Component({
  templateUrl: "BuyTableView.html",
  selector: "wunder-mobility-buy-table"
}) export class BuyTableComponent {

  public ScannedProducts: ScannedProduct[] = [];

  public Columns = [
    { field:"ProductCode", header: "Product Code"},
    { field:"Quantity", header: "Quantity"}
  ];

  public Delete(data: ScannedProduct): void {
    const index = this.ScannedProducts.indexOf(data);
    this.ScannedProducts.splice(index, 1);
  }

  public Checkout(): void {
    console.log("Checkout table");
  }

  public AddNewRandomScan(): void {
    const randomId = Math.floor(Math.random() * Math.floor(10) + 1);
    let added = false;
    for (let i = 0; i < this.ScannedProducts.length; i++) {
      if (this.ScannedProducts[i].ProductCode == randomId) {
        this.ScannedProducts[i].Quantity++;
        added = true;
      }
    }

    if (!added) {
      const newProduct: ScannedProduct = {
        ProductCode: randomId,
        Quantity: 1
      };

      this.ScannedProducts.push(newProduct);
    }

  }
}
