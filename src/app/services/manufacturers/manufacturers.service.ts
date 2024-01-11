import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Manufacturer } from '../../models/manufacturer.model';

@Injectable({
  providedIn: 'root'
})
export class ManufacturersService {
  private baseApiUrl: string = 'https://localhost:7048';

  constructor(private http: HttpClient) { }

  getAllManufacturers(): Observable<Manufacturer[]> {
    return this.http.get<Manufacturer[]>(this.baseApiUrl + '/api/manufacturers/get-all');
  }

  addManufacturer(request: Object): Observable<Manufacturer> {
    return this.http.post<Manufacturer>(this.baseApiUrl + '/api/manufacturers/add', request);
  }
}
