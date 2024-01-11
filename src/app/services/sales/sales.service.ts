import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { Sale } from '../../models/sale.model'
import { SaleStatusEnum } from '../../models/enums/sale-status.enum'
import { Discount } from '../../models/discount.model'

@Injectable({
  providedIn: 'root'
})
export class SalesService {
  private baseApiUrl: string = 'https://localhost:7048';

  constructor(private http: HttpClient) { }

  getOpenedSale(): Observable<Sale> {
    return this.http.get<Sale>(this.baseApiUrl + '/api/point-of-sales/get-opened-sale');
  }

  addProductToSale(request: Object): Observable<Sale> {
    return this.http.post<Sale>(this.baseApiUrl + '/api/point-of-sales/add-product', request);
  }

  deleteProductFromSale(order: number): Observable<Sale> {
    return this.http.delete<Sale>(this.baseApiUrl + `/api/point-of-sales/delete-product/${order}`)
  }

  addDiscountToSale(request: Discount): Observable<Sale> {
    return this.http.patch<Sale>(this.baseApiUrl + `/api/point-of-sales/add-discount`, request);
  }

  changeOpenedSaleStatus(request: Object): Observable<Sale | undefined> {
    return this.http.put<Sale | undefined>(this.baseApiUrl + '/api/point-of-sales/change-opened-sale-status', request);
  }
}
