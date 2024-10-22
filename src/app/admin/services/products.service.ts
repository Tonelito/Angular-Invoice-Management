import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL_PRODUCTS } from 'src/app/shared/utilities/constants.utility';
import { ProductResponse, Products } from '../utilities/models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  url = API_URL_PRODUCTS;
  constructor(private http: HttpClient) { }

  getProducts(page: number, size: number): Observable<Products> {
    return this.http.get<Products>(`${this.url}/show-all?page=${page}&size=${size}`);
  }

  getProductByName(productData: any, page: number, size: number): Observable<Products> {
    return this.http.post<Products>(`${this.url}/search-by-name?page=${page}&size=${size}`, productData);
  }

  getProductById(id: number): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(`${this.url}/show-by-id/${id}`);
  }

  addProduct(productData: any): Observable<any> {
    return this.http.post(`${this.url}/create`, productData);
  }

  updateProduct(id: number, productData: any): Observable<any> {
    return this.http.put(`${this.url}/update/${id}`, productData);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/delete/${id}`);
  }

  changeStatus(id: number): Observable<any> {
    return this.http.put(`${this.url}/toggle-status/${id}`, {});
  }
}
