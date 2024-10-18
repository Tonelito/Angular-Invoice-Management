import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL_PRODUCTS } from 'src/app/shared/utilities/constants.utility';
import { Products } from '../utilities/models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  url = API_URL_PRODUCTS;
  constructor(private http: HttpClient) { }

  getProducts(page: number, size: number): Observable<Products> {
    return this.http.get<Products>(`${this.url}s?page=${page}&size=${size}`);
  }
}
