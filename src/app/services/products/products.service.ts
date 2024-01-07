import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../../models/product.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  baseApiUrl: string = 'https://localhost:7048';

  constructor(private http: HttpClient) { }

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.baseApiUrl + '/api/products/get-all');
  }

  getProductByBarcode(barcode: string): Observable<Product> {
    return this.http.get<Product>(this.baseApiUrl + '/api/products/get-by-barcode/' + barcode);
  }

  addProduct(request: Object): Observable<Product> {
    return this.http.post<Product>(this.baseApiUrl + '/api/products/add', request);
  }
}
