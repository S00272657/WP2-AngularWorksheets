import { CanActivateFn } from '@angular/router';
import { AuthCustomService } from './auth-custom.service';
import { Router } from '@angular/router';
import { inject } from '@angular/core';


export const authGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthCustomService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  } else {
    return router.createUrlTree(['/login'], {
      queryParams: { returnUrl: state.url }});
  }

};

