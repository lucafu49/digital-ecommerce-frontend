import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Client } from '../Interfaces/client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private url :string = 'http://localhost:3000/api/';

  constructor(private http: HttpClient) { }

  registerClient(request:any):Observable<Client>{
    return this.http.post<Client>(`${this.url}auth/register`, request);
  }
}
