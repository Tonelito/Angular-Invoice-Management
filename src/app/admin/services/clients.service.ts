import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL_CUSTOMER } from 'src/app/shared/utilities/constants.utility';
import { Clients } from '../utilities/models/client.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientsService {

  url = API_URL_CUSTOMER;

  constructor(private http: HttpClient) { }

  getCustomers(page: number, size: number): Observable<Clients> {
    return this.http.get<Clients>(`${this.url}s?page=${page}&size=${size}`);
  }

  addClient(clientData: any): Observable<any> {
    return this.http.post(`${this.url}`, clientData);
  }
}
