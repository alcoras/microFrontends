import { Injectable } from '@angular/core';
import { from } from 'rxjs';
import { Product } from '../interfaces/Product';

@Injectable()
export class ProductService {

  public status: string[] = ['OUTOFSTOCK', 'INSTOCK', 'LOWSTOCK'];

    public productNames: string[] = [
        "Bamboo Watch",
        "Black Watch",
        "Blue Band",
        "Blue T-Shirt",
        "Bracelet",
        "Brown Purse",
        "Chakra Bracelet",
        "Galaxy Earrings",
        "Game Controller",
        "Gaming Set",
        "Gold Phone Case",
        "Green Earbuds",
        "Green T-Shirt",
        "Grey T-Shirt",
        "Headphones",
        "Light Green T-Shirt",
        "Lime Band",
        "Mini Speakers",
        "Painted Phone Case",
        "Pink Band",
        "Pink Purse",
        "Purple Band",
        "Purple Gemstone Necklace",
        "Purple T-Shirt",
        "Shoes",
        "Sneakers",
        "Teal T-Shirt",
        "Yellow Earbuds",
        "Yoga Mat",
        "Yoga Set",
    ];

    public generateProducts(amount: number): Product[] {
      const products: Product[] = [];

      for (let i = 0; i < amount; i++) {
        products.push(this.generatePrduct());
      }

      return products;
    }

    public generatePrduct(): Product {
        const product: Product =  {
            code: this.generateId(),
            id: this.generateId(),
            name: this.generateName(),
            description: "Product Description",
            price: this.generatePrice(),
            quantity: this.generateQuantity(),
            category: "Product Category",
            inventoryStatus: this.generateStatus(),
            rating: this.generateRating()
        };

        product.image = product.name.toLocaleLowerCase().split(/[ ,]+/).join('-')+".jpg";
        return product;
    }

    public generateId() {
        let text = "";
        const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (let i = 0; i < 5; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        return text;
    }

    public generateName() {
        return this.productNames[Math.floor(Math.random() * Math.floor(30))];
    }

    public generatePrice() {
        return Math.floor(Math.random() * Math.floor(299)+1);
    }

    public generateQuantity() {
        return Math.floor(Math.random() * Math.floor(75)+1);
    }

    public generateStatus() {
        return this.status[Math.floor(Math.random() * Math.floor(3))];
    }

    public generateRating() {
        return Math.floor(Math.random() * Math.floor(5)+1);
    }
}
