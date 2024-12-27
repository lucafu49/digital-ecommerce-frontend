import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  token = '';

  constructor(private http: HttpClient) { }

  getToken(): string | null {
    if (typeof window !== 'undefined' && localStorage) {
      return localStorage.getItem('token');
    }
    return null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  isUserAdmin(): boolean {
    const token = this.getToken();
    console.log(token);
    if (!token) return false;

    console.log("HOLA")

    try {
      const decodedToken: any = jwtDecode(token);
      console.log(decodedToken);
      return decodedToken.role === 'ADMIN_ROLE';
    } catch (error) {
      console.error('Token decoding error:', error);
      return false;
    }
  }
}
