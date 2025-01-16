import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private isLoggedInSubject = new BehaviorSubject<boolean>(this.isLoggedIn());
  private isAdminSubject = new BehaviorSubject<boolean>(this.isUserAdmin());

  isLoggedIn$ = this.isLoggedInSubject.asObservable();
  isAdmin$ = this.isAdminSubject.asObservable();

  token = '';

  constructor(private http: HttpClient) { }


  login(token: string) {
    const tokenData = {
      token,
      timeLogged: new Date().toISOString(),
    };

    localStorage.setItem('token', JSON.stringify(tokenData));

    // Emitir los cambios de estado
    this.isLoggedInSubject.next(true);
    this.isAdminSubject.next(this.isUserAdmin());
  }

  getToken(): string | null {
    if (typeof window !== 'undefined' && localStorage) {
      const tokenData = localStorage.getItem('token');
      if (tokenData) {
        try {
          const parsedToken = JSON.parse(tokenData); // Convertir de JSON a objeto
          return parsedToken.token; // Extraer solo el token
        } catch (error) {
          console.error('Error parsing token from localStorage:', error);
          return null;
        }
      }
    }
    return null;
  }

  isLoggedIn(): boolean {
    this.checkTokenExpiration();
    return !!this.getToken(); // Verificar si hay un token válido
  }

  isUserAdmin(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decodedToken: any = jwtDecode(token);
      return decodedToken.role === 'ADMIN_ROLE';
    } catch (error) {
      console.error('Token decoding error:', error);
      return false;
    }
  }

  private checkTokenExpiration(): void {
    if (typeof window === 'undefined' || !localStorage) return;

    const tokenData = localStorage.getItem('token');
    if (tokenData) {
      try {
        const parsedToken = JSON.parse(tokenData); // Parsear el token
        const timeLogged = new Date(parsedToken.timeLogged).getTime(); // Convertir a timestamp
        const now = new Date().getTime(); // Timestamp actual

        const token = parsedToken.token;
        const decodedToken: any = jwtDecode(token);

        // Definir los límites de tiempo
        const isAdmin = decodedToken.role === 'ADMIN_ROLE';
        const expirationLimit = isAdmin ? 10 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000; // 10 minutos o 7 días

        if (now - timeLogged > expirationLimit) {
          console.warn('Token expirado. Eliminando...');
          localStorage.removeItem('token'); // Borrar token si está expirado
        }
      } catch (error) {
        console.error('Error verificando la expiración del token:', error);
        localStorage.removeItem('token'); // Borrar si ocurre un error
      }
    }
  }

  logout() {
    if (typeof window !== 'undefined' && localStorage) {
      localStorage.removeItem('token');
    }
  }
}
