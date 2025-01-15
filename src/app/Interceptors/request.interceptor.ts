import { HttpInterceptorFn } from '@angular/common/http';

export const requestInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenData = localStorage.getItem('token'); // Obtén el token del localStorage
  let token = '';

  if (tokenData) {
    try {
      const parsedToken = JSON.parse(tokenData); // Parsear el JSON a un objeto
      token = parsedToken.token; // Extraer solo el token
    } catch (error) {
      console.error('Error parsing token from localStorage:', error);
    }
  }

  const cloneRequest = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}` // Usar solo el token en la cabecera
    }
  });

  return next(cloneRequest);
};
