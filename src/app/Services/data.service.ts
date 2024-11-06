import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../Interfaces/category';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private url = 'http://localhost:3000/api/'

  constructor(private http:HttpClient) { }

  getCategories(): Observable<Category>{
    return this.http.get<Category>(`${this.url}category`)
  }
}
