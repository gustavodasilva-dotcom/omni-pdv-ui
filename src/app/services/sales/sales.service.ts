import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { environment } from '../../../environments/environment.development'
import { Sale } from '../../models/sale.model'
import { JsonResult } from '../../models/http/json-result.model'
import { AddProductRequestToSale } from './models/add-product-to-sale.model'
import { ChangeSaleStatus } from './models/change-sale-status.model'
import { AddDiscountToSale } from './models/add-discount-to-sale.model'
import { AddClientToSale } from './models/add-client-to-sale.model'
import { SendReceiptToEmail } from './models/send-receipt-email.mode'

@Injectable({
  providedIn: 'root'
})
export class SalesService {
  private baseApiUrl: string = environment.baseApiUrl;

  constructor(private http: HttpClient) { }

  getOpenedSale = (): Observable<JsonResult<Sale>> =>
    this.http.get<JsonResult<Sale>>(this.baseApiUrl + '/api/v1/point-of-sales/get-opened-sale');

  addProductToSale = (request: AddProductRequestToSale): Observable<JsonResult<Sale>> =>
    this.http.post<JsonResult<Sale>>(this.baseApiUrl + '/api/v1/point-of-sales/add-product', request);

  changeOpenedSaleStatus = (request: ChangeSaleStatus): Observable<JsonResult<Sale | undefined>> =>
    this.http.put<JsonResult<Sale | undefined>>(this.baseApiUrl + '/api/v1/point-of-sales/change-opened-sale-status', request);

  sendReceiptToEmail = (request: SendReceiptToEmail) =>
    this.http.put(this.baseApiUrl + '/api/v1/point-of-sales/send-receipt-email', request);

  addDiscountToSale = (request: AddDiscountToSale): Observable<JsonResult<Sale>> =>
    this.http.patch<JsonResult<Sale>>(this.baseApiUrl + `/api/v1/point-of-sales/add-discount`, request);

  addClientToSale = (request: AddClientToSale): Observable<JsonResult<Sale>> =>
    this.http.patch<JsonResult<Sale>>(this.baseApiUrl + `/api/v1/point-of-sales/add-client`, request);

  deleteProductFromSale = (order: number): Observable<JsonResult<Sale>> =>
    this.http.delete<JsonResult<Sale>>(this.baseApiUrl + `/api/v1/point-of-sales/delete-product/${order}`);
}
