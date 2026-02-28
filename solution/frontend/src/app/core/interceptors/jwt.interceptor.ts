import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const stored = authService.getToken();

  if (stored) {
    const parsed = JSON.parse(stored);
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${parsed.token}` }
    });
  }

  return next(req);
};
