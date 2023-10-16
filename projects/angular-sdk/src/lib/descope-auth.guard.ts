import { inject } from '@angular/core';

import { DescopeAuthService } from './descope-auth.service';
import {ActivatedRouteSnapshot, Router} from "@angular/router";
import {catchError, from, map, of, switchMap} from "rxjs";

export const descopeAuthGuard = (route: ActivatedRouteSnapshot) => {
  const authService = inject(DescopeAuthService);
  const router = inject(Router)
  const fallbackUrl = route.data['descopeFallbackUrl'];
  const isLoggedIn = authService.isLoggedIn();
  if (!isLoggedIn && !!fallbackUrl) {
    return from(router.navigate([fallbackUrl]));
  }
  return of(isLoggedIn);
};
