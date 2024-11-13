import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Category } from '../Interfaces/category';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private url :string = 'http://localhost:3000/api/';

  constructor(private http: HttpClient) { }

  updateCategory(request:any):Observable<Category>{
    return this.http.put<Category>(`${this.url}category`, request);
  }
  deleteCategory(request: any):Observable<Category>{
    return this.http.delete<Category>(`${this.url}category`, {body:request});
  }
  createCategory(request:Category):Observable<Category>{
    return this.http.post<Category>(`${this.url}category`, request);
  }
  
}
