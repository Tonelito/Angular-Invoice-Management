import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL_CUSTOMER } from 'src/app/shared/utilities/constants.utility';
import {
  ClientName,
  ClientResponse,
  Clients
} from '../utilities/models/client.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientsService {
  url = API_URL_CUSTOMER;

  constructor(private readonly http: HttpClient) {}

  getCustomers(page: number, size: number): Observable<Clients> {
    return this.http.get<Clients>(
      `${this.url}/show-all?page=${page}&size=${size}`
    );
  }

  getCustomerById(id: number): Observable<ClientResponse> {
    return this.http.get<ClientResponse>(`${this.url}/show-by-id/${id}`);
  }

  getCustomerByName(
    customerData: any,
    page: number,
    size: number
  ): Observable<ClientName> {
    return this.http.post<ClientName>(
      `${this.url}/search-by-name?page=${page}&size=${size}`,
      customerData
    );
  }

  addClient(clientData: any): Observable<any> {
    return this.http.post(`${this.url}/createa`, clientData);
  }

  updateClient(id: number, clientData: any): Observable<any> {
    return this.http.put(`${this.url}/update/${id}`, clientData);
  }

  deleteClient(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/delete/${id}`);
  }
  changeStatus(id: number): Observable<any> {
    return this.http.put(`${this.url}/toggle-status/${id}`, {});
  }
}
