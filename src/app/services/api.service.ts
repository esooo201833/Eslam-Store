import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'https://flat-teams-report.loca.lt/api';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    });
  }

  // Auth
  register(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, data);
  }

  login(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, data);
  }

  getProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/auth/profile`, { headers: this.getHeaders() });
  }

  verifyOTP(data: { email: string; otp: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/verify-otp`, data);
  }

  resendOTP(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/resend-otp`, { email });
  }

  // Products
  getProducts(params?: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/products`, { params });
  }

  getProductById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/products/${id}`);
  }

  createProduct(data: any, image?: File): Observable<any> {
    const formData = new FormData();
    Object.keys(data).forEach(key => formData.append(key, data[key]));
    if (image) formData.append('image', image);
    return this.http.post(`${this.apiUrl}/products`, formData, { headers: this.getHeaders() });
  }

  updateProduct(id: number, data: any, image?: File): Observable<any> {
    const formData = new FormData();
    Object.keys(data).forEach(key => formData.append(key, data[key]));
    if (image) formData.append('image', image);
    return this.http.put(`${this.apiUrl}/products/${id}`, formData, { headers: this.getHeaders() });
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/products/${id}`, { headers: this.getHeaders() });
  }

  // Cart
  getCart(): Observable<any> {
    return this.http.get(`${this.apiUrl}/cart`, { headers: this.getHeaders() });
  }

  addToCart(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/cart`, data, { headers: this.getHeaders() });
  }

  updateCartQuantity(data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/cart`, data, { headers: this.getHeaders() });
  }

  removeFromCart(productId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/cart/${productId}`, { headers: this.getHeaders() });
  }

  clearCart(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/cart`, { headers: this.getHeaders() });
  }

  // Orders
  createOrder(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/orders`, data, { headers: this.getHeaders() });
  }

  getUserOrders(): Observable<any> {
    return this.http.get(`${this.apiUrl}/orders`, { headers: this.getHeaders() });
  }

  getOrderById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/orders/${id}`, { headers: this.getHeaders() });
  }

  getAllOrders(params?: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/orders/admin/all`, { headers: this.getHeaders(), params });
  }

  updateOrderStatus(id: number, status: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/orders/${id}/status`, { status }, { headers: this.getHeaders() });
  }

  // Payment
  createPaymentIntent(amount: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/payment/create-intent`, { amount }, { headers: this.getHeaders() });
  }

  confirmPayment(paymentIntentId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/payment/confirm`, { payment_intent_id: paymentIntentId }, { headers: this.getHeaders() });
  }
}
