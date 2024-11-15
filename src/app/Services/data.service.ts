import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GetCategoriesResponse } from '../Interfaces/Responses/categories';
import { GetSourceFileResponse } from '../Interfaces/Responses/source-files';
import { Packages } from '../Interfaces/Responses/packages';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private url : string = 'http://localhost:3000/api/'

  constructor(private http:HttpClient) { }

  getCategories(): Observable<GetCategoriesResponse>{
    return this.http.get<GetCategoriesResponse>(`${this.url}category`)
  }
  getSourceFiles():Observable<GetSourceFileResponse>{
    return this.http.get<GetSourceFileResponse>(`${this.url}source-file`)
  }

  getPackages(page:string ,orderBy : string, lir: string, maxPrice : string, minPrice : string):Observable<Packages>{
    return this.http.get<Packages>(`${this.url}package?page=${page}&limit=10&orderBy=${orderBy}:${lir}&maxPrice=${maxPrice}&minPrice=${minPrice}`);
  }
}
