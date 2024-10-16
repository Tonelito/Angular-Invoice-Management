import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL_ORDERS } from 'src/app/shared/utilities/constants.utility';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  url = API_URL_ORDERS;

  constructor(private readonly http: HttpClient) {}

  sendOrder(OrderData: any): Observable<any> {
    return this.http.post(`${this.url}/create`, OrderData);
  }
}
