import { Component } from '@angular/core';
import { environment } from '../environments/environment';
import { Product } from './interfaces/Product';
import { ProductService } from './services/ProductService';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  styles: [`
    :host ::ng-deep .p-datatable .p-datatable-thead > tr > th {
        position: -webkit-sticky;
        position: sticky;
        top: 10px;
    }

    @media screen and (max-width: 64em) {
        :host ::ng-deep .p-datatable .p-datatable-thead > tr > th {
            top: 99px;
        }
    }
  `]
})
export class AppComponent {

  public products: Product[] = ProductService.generateProducts(100);
  public cols = [
    { field: 'code', header: 'Code' },
    { field: 'name', header: 'Name' },
    { field: 'category', header: 'Category' },
    { field: 'quantity', header: 'Quantity' }
  ];

  public languages = ['en', 'lt', 'ru', 'ua'];
  public constructor(private productService: ProductService) {}

  public onLanguageSelected(languageSelected: string): void {
    environment.currentLanguage = languageSelected;
  }
}
