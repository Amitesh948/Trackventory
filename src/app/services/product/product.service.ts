import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Product {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image?: File;
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'http://localhost:5000/api/products';

  constructor(private http: HttpClient) {}

  addProduct(productData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, productData);
  }

  getProducts(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }

  getProductById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  updateProduct(id: string, productData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/${id}`, productData);
  }

  deleteProduct(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }
}
