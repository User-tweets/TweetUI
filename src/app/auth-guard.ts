import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  let token;
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('token');
  }
  let router = inject(Router);
  if (token) {
    return true;
  } else {
    router.navigate(['/']);
    return false;
  }
};
