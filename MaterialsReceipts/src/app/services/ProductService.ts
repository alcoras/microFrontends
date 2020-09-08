import { Injectable } from '@angular/core';
import { Product } from '../interfaces/Product';

@Injectable()
export class ProductService {

  public static status: string[] = ['OUTOFSTOCK', 'INSTOCK', 'LOWSTOCK'];

    public static productNames: string[] = [
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

    public static generateProducts(amount: number): Product[] {
      const products: Product[] = [];

      for (let i = 0; i < amount; i++) {
        products.push(this.generatePrduct());
      }

      return products;
    }

    public static generatePrduct(): Product {
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

    public static generateId() {
        let text = "";
        const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (let i = 0; i < 5; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        return text;
    }

    public static generateName() {
        return this.productNames[Math.floor(Math.random() * Math.floor(30))];
    }

    public static generatePrice() {
        return Math.floor(Math.random() * Math.floor(299)+1);
    }

    public static generateQuantity() {
        return Math.floor(Math.random() * Math.floor(75)+1);
    }

    public static generateStatus() {
        return this.status[Math.floor(Math.random() * Math.floor(3))];
    }

    public static generateRating() {
        return Math.floor(Math.random() * Math.floor(5)+1);
    }
}
