import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL_CUSTOMER } from 'src/app/shared/utilities/constants.utility';
import { Client, ClientResponse, Clients } from '../utilities/models/client.model';
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
  getCustomerById(id: number): Observable<ClientResponse> {
    return this.http.get<ClientResponse>(`${this.url}/${id}`);
  }

  addClient(clientData: any): Observable<any> {
    return this.http.post(`${this.url}`, clientData);
  }
}
