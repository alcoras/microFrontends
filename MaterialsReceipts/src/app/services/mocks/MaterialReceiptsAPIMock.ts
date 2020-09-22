import { Injectable } from '@angular/core';
import { IMaterialsReceiptsAPI } from '../../interfaces/IMaterialsReceiptsAPI';
import { GetMaterialsList } from '../../interfaces/GetMaterialsList';
import { MaterialsList } from '@uf-shared-models/index';
import { ProductService } from '../ProductService';

@Injectable({
  providedIn: 'root',
})
export class MaterialsReceiptsAPIMock implements IMaterialsReceiptsAPI {


  private data: MaterialsList[];

  public constructor() {
    this.data = [];

    for (let index = 0; index < 1000; index++) {
      const temp: MaterialsList = {
        Number: ProductService.generateQuantity(),
        RegisterDateTime: ProductService.generateName(),
        SignMark: true,
        SignPerson: ProductService.generateName()
      }
      this.data.push(temp);
    }
  }

  public Get(page: number, limit: number): Promise<GetMaterialsList> {
    const items = this.data.slice(page, (page + limit));
    return Promise.resolve({Items: items, Total: this.data.length})
  }

}
