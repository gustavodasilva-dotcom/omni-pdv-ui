import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Sale } from '../../models/sale.model';
import { Observable } from 'rxjs';

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
}
