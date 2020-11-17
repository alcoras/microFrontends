import { Injectable } from '@angular/core';
import { MaterialsListDTO, ReadListQueryParams, MaterialsList } from '../../Models/index';
import { ProductService } from '../ProductService';

@Injectable({
  providedIn: 'root',
})
export class MaterialsReceiptsAPIMock {

  private data: MaterialsList[];

  public constructor() {
    this.data = [];

    for (let index = 0; index < 10; index++) {
      const temp: MaterialsList = {
        Id: +ProductService.generateId(),
        Number: ProductService.generateQuantity(),
        RegisterDateTime: ProductService.generateName(),
        SignMark: true,
        SignPerson: ProductService.generateName()
      }
      this.data.push(temp);
    }
  }

  public MaterialsReceiptsListQuery(queryParams: ReadListQueryParams): Promise<MaterialsListDTO> {
    const items = this.data.slice(queryParams.Page, (queryParams.Page + queryParams.Limit));
    return Promise.resolve({Items: items, Total: this.data.length})
  }

}
