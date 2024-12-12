import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GetCategoriesResponse } from '../Interfaces/Responses/categories';
import { GetSourceFileResponse } from '../Interfaces/Responses/source-files';
import { Packages, ResponsePackages } from '../Interfaces/Responses/packages';
import { Package } from '../Interfaces/package';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private url : string = 'https://digital-ecommerce-jt70.onrender.com/api/'

  private storageKey = 'categories';


  saveCategories(categories: any[]) {
    localStorage.setItem(this.storageKey, JSON.stringify(categories));
    console.log('Categorías guardadas en localStorage:', categories);
  }

  getCategoriesLocalStorage(): any[] | null {
    const storedCategories = localStorage.getItem(this.storageKey);
    return storedCategories ? JSON.parse(storedCategories) : null;
  }

  constructor(private http:HttpClient) { }

  getCategories(): Observable<GetCategoriesResponse>{
    return this.http.get<GetCategoriesResponse>(`${this.url}category`)
  }
  getPopularCategories():Observable<GetCategoriesResponse>{
    return this.http.get<GetCategoriesResponse>(`${this.url}category/popular-categories`)
  }
  getSourceFiles():Observable<GetSourceFileResponse>{
    return this.http.get<GetSourceFileResponse>(`${this.url}source-file`)
  }

  getPackages(page:string ,orderBy : string, lir: string, maxPrice : string, minPrice : string):Observable<ResponsePackages>{
    return this.http.get<ResponsePackages>(`${this.url}package?page=${page}&limit=9&orderBy=${orderBy}:${lir}&maxPrice=${maxPrice}&minPrice=${minPrice}`);
  }

  getPackagesByCategory(categoryId : string, page:string ,orderBy : string, lir: string, maxPrice : string, minPrice : string):Observable<ResponsePackages>{
    return this.http.get<ResponsePackages>(`${this.url}package/category/${categoryId}/?page=${page}&limit=9&orderBy=${orderBy}:${lir}&maxPrice=${maxPrice}&minPrice=${minPrice}`);
  }

  getPackageByWord(word : string ,page:string ,orderBy : string, lir: string, maxPrice : string, minPrice : string):Observable<ResponsePackages>{
    return this.http.get<ResponsePackages>(`${this.url}package/word/${word}?page=${page}&limit=9&orderBy=${orderBy}:${lir}&maxPrice=${maxPrice}&minPrice=${minPrice}`);
  }


}
