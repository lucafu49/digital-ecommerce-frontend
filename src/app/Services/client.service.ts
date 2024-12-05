import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RegisterRequest } from '../Interfaces/register-request';
import { Observable } from 'rxjs';
import { LoginRequest } from '../Interfaces/login-request';
import { RegisterResponse } from '../Interfaces/Responses/login-register';
import { LoginResponse } from '../Interfaces/Responses/login-register';
import { AddCartRequest } from '../Interfaces/add-cart-request';
import { Cart } from '../Interfaces/Responses/cart';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private url :string = 'https://digital-ecommerce-jt70.onrender.com/api/';

  constructor(private http: HttpClient) { }

  registerClient(request:RegisterRequest):Observable<RegisterResponse>{
    return this.http.post<RegisterResponse>(`${this.url}auth/register`, request);
  }
  loginClient(request:LoginRequest):Observable<LoginResponse>{
    return this.http.post<LoginResponse>(`${this.url}auth/login`, request);
  }

  addItemtoCart(packageId : AddCartRequest){
    return this.http.post(`${this.url}cart`, packageId);
  }

  getCart():Observable<Cart>{
    return this.http.get<Cart>(`${this.url}cart`)
  }

  deletePackageFromCart(packageId : AddCartRequest){
    return this.http.delete(`${this.url}cart`, {body: packageId});
  }
}
