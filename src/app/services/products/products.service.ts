import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../../models/product.model';
import { Observable } from 'rxjs';
import { JsonResult } from '../../models/http/json-result.model';
import { Guid } from 'guid-typescript';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private baseApiUrl: string = 'https://localhost:7048';

  constructor(private http: HttpClient) { }

  getAll = (): Observable<JsonResult<Product[]>> =>
    this.http.get<JsonResult<Product[]>>(this.baseApiUrl + '/api/products/get-all');

  getProductByBarcode = (barcode: string): Observable<JsonResult<Product>> =>
    this.http.get<JsonResult<Product>>(this.baseApiUrl + '/api/products/get-by-barcode/' + barcode);

  add = (request: Object): Observable<JsonResult<Product>> =>
    this.http.post<JsonResult<Product>>(this.baseApiUrl + '/api/products/add', request);

  update = (id: string, request: Object): Observable<JsonResult<Product>> =>
    this.http.put<JsonResult<Product>>(this.baseApiUrl + `/api/products/update/${id}`, request);

  delete = (id: Guid) => this.http.delete(this.baseApiUrl + `/api/products/delete/${id}`);
}
