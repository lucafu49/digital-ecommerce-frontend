import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RegisterRequest } from '../Interfaces/register-request';
import { Observable } from 'rxjs';
import { LoginRequest } from '../Interfaces/login-request';
import { RegisterResponse } from '../Interfaces/Responses/login-register';
import { LoginResponse } from '../Interfaces/Responses/login-register';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private url :string = 'http://localhost:3000/api/';

  constructor(private http: HttpClient) { }

  registerClient(request:RegisterRequest):Observable<RegisterResponse>{
    return this.http.post<RegisterResponse>(`${this.url}auth/register`, request);
  }
  loginClient(request:LoginRequest):Observable<LoginResponse>{
    return this.http.post<LoginResponse>(`${this.url}auth/login`, request);
  }
}
