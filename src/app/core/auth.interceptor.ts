import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthCustomService } from './auth/auth-custom.service';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
    
  const router = inject(Router);
  const authService = inject(AuthCustomService);

  const apiUri = `http://localhost:3000/api/v1`;

  const jwt = authService.token;

  // we don't want to attach our token to a request to any other server
  // so we check that the request is to our own api
  // if so we create a new request with the Bearer token
  // if not we just copy the existing request.

  const authRequest = req.url.startsWith(apiUri) && jwt
    ? req.clone({ setHeaders: { Authorization: `Bearer ${jwt}` } })
    : req;

    return next(authRequest).pipe(
      catchError((err) => {
        console.log('Request failed ' + err.status);

      // Handle missing or invalid JWT (401)

      if (err.status === 401 ) {
        authService.logout(); // Clear any stored tokens
        router.navigate(['/login']); // Redirect to login page
      }

        return throwError(() => err);
      })
    );

}
