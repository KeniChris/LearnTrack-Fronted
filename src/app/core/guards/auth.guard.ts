import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  if (inject(AuthService).isLoggedIn()) {
    return true;
  }
  return router.createUrlTree(['/login']);
};
