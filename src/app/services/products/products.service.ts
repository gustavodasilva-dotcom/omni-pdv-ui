import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Guid } from 'guid-typescript';
import { environment } from '../../../environments/environment.development';
import { Product } from '../../models/product.model';
import { JsonResult } from '../../models/http/json-result.model';
import { SaveProduct } from './models/save-product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private baseApiUrl: string = environment.baseApiUrl;

  constructor(private http: HttpClient) { }

  getAll = (): Observable<JsonResult<Product[]>> =>
    this.http.get<JsonResult<Product[]>>(this.baseApiUrl + '/api/products/get-all');

  getProductByBarcode = (barcode: string): Observable<JsonResult<Product>> =>
    this.http.get<JsonResult<Product>>(this.baseApiUrl + '/api/products/get-by-barcode/' + barcode);

  add = (request: SaveProduct): Observable<JsonResult<Product>> =>
    this.http.post<JsonResult<Product>>(this.baseApiUrl + '/api/products/add', request);

  update = (id: string, request: SaveProduct): Observable<JsonResult<Product>> =>
    this.http.put<JsonResult<Product>>(this.baseApiUrl + `/api/products/update/${id}`, request);

  delete = (id: Guid) => this.http.delete(this.baseApiUrl + `/api/products/delete/${id}`);
}
