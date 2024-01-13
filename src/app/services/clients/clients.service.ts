import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Guid } from 'guid-typescript';
import { JsonResult } from '../../models/http/json-result.model';
import { Client } from '../../models/client.model';
import { SaveClient } from './models/save-client.model';

@Injectable({
  providedIn: 'root'
})
export class ClientsService {
  private baseApiUrl: string = 'https://localhost:7048';

  constructor(private http: HttpClient) { }

  getAll = (): Observable<JsonResult<Client[]>> =>
    this.http.get<JsonResult<Client[]>>(this.baseApiUrl + '/api/clients/get-all');

  add = (request: SaveClient): Observable<JsonResult<Client>> =>
    this.http.post<JsonResult<Client>>(this.baseApiUrl + '/api/clients/add', request);

  update = (id: string, request: SaveClient): Observable<JsonResult<Client>> =>
    this.http.put<JsonResult<Client>>(this.baseApiUrl + `/api/clients/update/${id}`, request);

  delete = (id: Guid) => this.http.delete(this.baseApiUrl + `/api/clients/delete/${id}`);
}
