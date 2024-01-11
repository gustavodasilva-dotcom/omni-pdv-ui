import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { Sale } from '../../models/sale.model'
import { Discount } from '../../models/discount.model'
import { JsonResult } from '../../models/http/json-result.model'

@Injectable({
  providedIn: 'root'
})
export class SalesService {
  private baseApiUrl: string = 'https://localhost:7048';

  constructor(private http: HttpClient) { }

  getOpenedSale(): Observable<JsonResult<Sale>> {
    return this.http.get<JsonResult<Sale>>(this.baseApiUrl + '/api/point-of-sales/get-opened-sale');
  }

  addProductToSale(request: Object): Observable<JsonResult<Sale>> {
    return this.http.post<JsonResult<Sale>>(this.baseApiUrl + '/api/point-of-sales/add-product', request);
  }

  deleteProductFromSale(order: number): Observable<JsonResult<Sale>> {
    return this.http.delete<JsonResult<Sale>>(this.baseApiUrl + `/api/point-of-sales/delete-product/${order}`)
  }

  addDiscountToSale(request: Discount): Observable<JsonResult<Sale>> {
    return this.http.patch<JsonResult<Sale>>(this.baseApiUrl + `/api/point-of-sales/add-discount`, request);
  }

  changeOpenedSaleStatus(request: Object): Observable<JsonResult<Sale | undefined>> {
    return this.http.put<JsonResult<Sale | undefined>>(this.baseApiUrl + '/api/point-of-sales/change-opened-sale-status', request);
  }
}
