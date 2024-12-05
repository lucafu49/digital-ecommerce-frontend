import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Category } from '../Interfaces/category';
import { Observable } from 'rxjs';
import { DeleteCatRequest } from '../Interfaces/delete-cat-request';
import { SourceFile } from '../Interfaces/source-file';
import { DeleteSourcefRequest } from '../Interfaces/delete-sourcef-request';
import { ResponsePackages } from '../Interfaces/Responses/packages';
import { Package } from '../Interfaces/package';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private url :string = 'https://digital-ecommerce-jt70.onrender.com/api/';

  constructor(private http: HttpClient) { }

  updateCategory(request:any):Observable<any>{
    return this.http.put<any>(`${this.url}category`, request);
  }
  deleteCategory(request: DeleteCatRequest):Observable<Category>{
    return this.http.delete<Category>(`${this.url}category`, {body:request});
  }
  createCategory(request:Category):Observable<Category>{
    return this.http.post<Category>(`${this.url}category`, request);
  }

  createSourceFile(request: SourceFile):Observable<SourceFile>{
    return this.http.post<SourceFile>(`${this.url}source-file`, request);
  }
  updateSourceFile(request: SourceFile): Observable<SourceFile> {
    return this.http.put<SourceFile>(`${this.url}source-file`, request);
  }
  deleteSourceFile(request: DeleteSourcefRequest):Observable<SourceFile>{
    return this.http.delete<SourceFile>(`${this.url}source-file`, {body:request});
  }

  getPackagesByAdmin(page:string ,orderBy : string, lir: string, maxPrice : string, minPrice : string):Observable<ResponsePackages>{
    return this.http.get<ResponsePackages>(`${this.url}package/admin?page=${page}&limit=15&orderBy=${orderBy}:${lir}&maxPrice=${maxPrice}&minPrice=${minPrice}`);
  }

  updatePackage(request : Package):Observable<Package>{
    return this.http.put<Package>(`${this.url}package`, request);
  }

  
}
