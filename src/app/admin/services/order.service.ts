import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Customers, Products } from '../utilities/models/order.model';
import {
  API_URL_CUSTOMER,
  API_URL_ORDER,
  API_URL_ORDER_DETAIL,
  API_URL_PAYMENT,
  API_URL_PRODUCTS
} from 'src/app/shared/utilities/constants.utility';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  constructor(private readonly http: HttpClient) {}

  customer_url = API_URL_CUSTOMER;
  product_url = API_URL_PRODUCTS;
  payment_url = API_URL_PAYMENT;
  orderDetails_url = API_URL_ORDER_DETAIL;
  order_url = API_URL_ORDER;

  getCustomers(): Observable<Customers> {
    return this.http.get<Customers>(`${this.customer_url}/show-all-customers`);
  }

  getProducts(): Observable<Products> {
    return this.http.get<Products>(`${this.product_url}/show-all-products`);
  }

  sendOrderDetails(OrderDetailsData: any): Observable<any> {
    return this.http.post<any>(
      `${this.orderDetails_url}/create`,
      OrderDetailsData
    );
  }

  sendOrder(OrderDetails: any): Observable<any> {
    return this.http.post<any>(`${this.order_url}`, OrderDetails);
  }
}
