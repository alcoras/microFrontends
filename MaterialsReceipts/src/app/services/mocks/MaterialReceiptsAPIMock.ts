import { Injectable } from '@angular/core';
import { GetMaterialsList } from '../../interfaces/GetMaterialsList';
import { MaterialsList } from '@uf-shared-models/index';
import { ProductService } from '../ProductService';
import { ReadListQueryParams } from 'src/app/helpers/ReadListQueryParams';

@Injectable({
  providedIn: 'root',
})
export class MaterialsReceiptsAPIMock {

  private data: MaterialsList[];

  public constructor() {
    this.data = [];

    for (let index = 0; index < 10; index++) {
      const temp: MaterialsList = {
        Number: ProductService.generateQuantity(),
        RegisterDateTime: ProductService.generateName(),
        SignMark: true,
        SignPerson: ProductService.generateName()
      }
      this.data.push(temp);
    }
  }

  public Get(queryParams: ReadListQueryParams): Promise<GetMaterialsList> {
    const items = this.data.slice(queryParams.Page, (queryParams.Page + queryParams.Limit));
    return Promise.resolve({Items: items, Total: this.data.length})
  }

}
