import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Category } from '../Interfaces/category';
import { Observable } from 'rxjs';
import { DeleteCatRequest } from '../Interfaces/delete-cat-request';
import { SourceFile } from '../Interfaces/source-file';
import { DeleteSourcefRequest } from '../Interfaces/delete-sourcef-request';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private url :string = 'https://digital-ecommerce-psi.vercel.app/api/';

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

  
}
