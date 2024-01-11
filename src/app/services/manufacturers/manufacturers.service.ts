import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { Manufacturer } from '../../models/manufacturer.model'
import { JsonResult } from '../../models/http/json-result.model'
import { ManufacturerModel } from '../../components/manufacturers/add-manufacturer-modal/models/default-options.model'
import { Guid } from 'guid-typescript'

@Injectable({
  providedIn: 'root'
})
export class ManufacturersService {
  private baseApiUrl: string = 'https://localhost:7048';

  constructor(private http: HttpClient) { }

  getAll(): Observable<JsonResult<Manufacturer[]>> {
    return this.http.get<JsonResult<Manufacturer[]>>(this.baseApiUrl + '/api/manufacturers/get-all');
  }

  add(request: ManufacturerModel): Observable<JsonResult<Manufacturer>> {
    return this.http.post<JsonResult<Manufacturer>>(this.baseApiUrl + '/api/manufacturers/add', request);
  }

  update(id: string, request: ManufacturerModel): Observable<JsonResult<Manufacturer>> {
    return this.http.put<JsonResult<Manufacturer>>(this.baseApiUrl + `/api/manufacturers/update/${id}`, request);
  }

  delete(id: Guid) {
    return this.http.delete(this.baseApiUrl + `/api/manufacturers/delete/${id}`);
  }
}
