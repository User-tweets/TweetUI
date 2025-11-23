import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Skip if request has 'skip' header
  if (req.headers.has('skip')) {
    return next(req);
  }

  // Get token from localStorage
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  // If token exists, clone request and add Authorization header
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(req);
};
