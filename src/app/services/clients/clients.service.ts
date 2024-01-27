import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Guid } from 'guid-typescript';
import { environment } from '../../../environments/environment.development';
import { JsonResult } from '../../models/http/json-result.model';
import { Client } from '../../models/client.model';
import { SaveClient } from './models/save-client.model';

@Injectable({
  providedIn: 'root'
})
export class ClientsService {
  private baseApiUrl: string = environment.baseApiUrl;

  constructor(private http: HttpClient) { }

  getAll = (): Observable<JsonResult<Client[]>> =>
    this.http.get<JsonResult<Client[]>>(this.baseApiUrl + '/api/v1/clients/get-all');

  add = (request: SaveClient): Observable<JsonResult<Client>> =>
    this.http.post<JsonResult<Client>>(this.baseApiUrl + '/api/v1/clients/add', request);

  update = (id: string, request: SaveClient): Observable<JsonResult<Client>> =>
    this.http.put<JsonResult<Client>>(this.baseApiUrl + `/api/v1/clients/update/${id}`, request);

  delete = (id: Guid) => this.http.delete(this.baseApiUrl + `/api/v1/clients/delete/${id}`);
}
