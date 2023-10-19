import {
	HttpHandlerFn,
	HttpInterceptorFn,
	HttpRequest
} from '@angular/common/http';
import { inject } from '@angular/core';
import { DescopeAuthService } from 'projects/angular-sdk/src/lib/descope-auth.service';

export const authenticationInterceptor: HttpInterceptorFn = (
	req: HttpRequest<unknown>,
	next: HttpHandlerFn
) => {
	const authService = inject(DescopeAuthService);
	const sessionToken = authService.getSessionToken();
	const modifiedReq = req.clone({
		headers: req.headers.set('Authorization', `Bearer ${sessionToken}`)
	});

	return next(modifiedReq);
};
