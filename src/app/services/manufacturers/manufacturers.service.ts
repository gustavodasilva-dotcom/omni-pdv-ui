import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { Guid } from 'guid-typescript'
import { environment } from '../../../environments/environment.development'
import { Manufacturer } from '../../models/manufacturer.model'
import { JsonResult } from '../../models/http/json-result.model'
import { SaveManufacturer } from './models/save-manufacturer.model'

@Injectable({
  providedIn: 'root'
})
export class ManufacturersService {
  private baseApiUrl: string = environment.baseApiUrl;

  constructor(private http: HttpClient) { }

  getAll = (): Observable<JsonResult<Manufacturer[]>> =>
    this.http.get<JsonResult<Manufacturer[]>>(this.baseApiUrl + '/api/v1/manufacturers/get-all');

  add = (request: SaveManufacturer): Observable<JsonResult<Manufacturer>> =>
    this.http.post<JsonResult<Manufacturer>>(this.baseApiUrl + '/api/v1/manufacturers/add', request);

  update = (id: string, request: SaveManufacturer): Observable<JsonResult<Manufacturer>> =>
    this.http.put<JsonResult<Manufacturer>>(this.baseApiUrl + `/api/v1/manufacturers/update/${id}`, request);

  delete = (id: Guid) => this.http.delete(this.baseApiUrl + `/api/v1/manufacturers/delete/${id}`);
}
