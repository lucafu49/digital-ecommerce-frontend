import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../Interfaces/category';
import { SourceFile } from '../Interfaces/source-file';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private url : string = 'http://localhost:3000/api/'

  constructor(private http:HttpClient) { }

  getCategories(): Observable<Category>{
    return this.http.get<Category>(`${this.url}category`)
  }
  getSourceFiles():Observable<SourceFile>{
    return this.http.get<Category>(`${this.url}source-file`)
  }
}
