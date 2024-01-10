import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Sale } from '../../models/sale.model';
import { Discount } from '../../models/discount.model';

@Injectable({
  providedIn: 'root'
})
export class SalesService {
  baseApiUrl: string = 'https://localhost:7048';

  constructor(private http: HttpClient) { }

  getOpenSale(): Observable<Sale> {
    return this.http.get<Sale>(this.baseApiUrl + '/api/sales/get-open-sale');
  }

  addProductToSale(request: Object): Observable<Sale> {
    return this.http.post<Sale>(this.baseApiUrl + '/api/sales/add-product', request);
  }

  deleteProductFromSale(order: number): Observable<Sale> {
    return this.http.delete<Sale>(this.baseApiUrl + `/api/sales/delete-product/${order}`)
  }

  addDiscountToSale(request: Discount): Observable<Sale> {
    return this.http.patch<Sale>(this.baseApiUrl + `/api/sales/add-discount`, request);
  }
}
