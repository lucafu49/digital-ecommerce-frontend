import { HttpInterceptorFn } from '@angular/common/http';

export const requestInterceptor: HttpInterceptorFn = (req, next) => {
  const myToken = localStorage.getItem('token');

  const cloneRequest = req.clone({
    setHeaders:{
      Authorization: `Bearer ${myToken}`
    }
  });

  return next(cloneRequest);
};
