import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { error } from 'console';
import { catchError, throwError } from 'rxjs';

export const errorHandlerInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(catchError((error: HttpErrorResponse) => {


    const errorMessage = error.error?.error || "Ocurrio un error inesperado";
    const errorCode = error.status;

    const customError = {
      message: errorMessage,
      status: errorCode,
    };

    return throwError(() => customError);
  }));
};
