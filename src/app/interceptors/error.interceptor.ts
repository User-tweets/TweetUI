import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error) => {
      // Handle 401 Unauthorized errors
      if (error.status === 401) {
        console.warn('401 Unauthorized - clearing token and redirecting to login');

        // Clear token from localStorage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          localStorage.removeItem('username');
        }

        // Redirect to login page
        router.navigate(['/']);
      }

      return throwError(() => error);
    }),
  );
};
