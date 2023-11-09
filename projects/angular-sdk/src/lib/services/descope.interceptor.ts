import { Injectable } from '@angular/core';
import {
	HttpErrorResponse,
	HttpEvent,
	HttpHandler,
	HttpInterceptor,
	HttpRequest
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { DescopeAuthService } from './descope-auth.service';
import { DescopeAuthConfig } from '../types/types';

@Injectable()
export class DescopeInterceptor implements HttpInterceptor {
	private pathsToIntercept: string[] = [];

	constructor(
		private authService: DescopeAuthService,
		config: DescopeAuthConfig
	) {
		this.pathsToIntercept = config.pathsToIntercept ?? [];
	}

	intercept(
		request: HttpRequest<unknown>,
		next: HttpHandler
	): Observable<HttpEvent<unknown>> {
		if (this.shouldIntercept(request)) {
			const token = this.authService.getSessionToken();
			if (!token) {
				return this.refreshAndRetry(request, next);
			}
			const requestWithToken = this.addTokenToRequest(request, token);
			return next.handle(requestWithToken).pipe(
				catchError((error: HttpErrorResponse) => {
					if (error.status === 401 || error.status === 403) {
						return this.refreshAndRetry(request, next, error);
					} else {
						return throwError(() => error);
					}
				})
			);
		} else {
			return next.handle(request);
		}
	}

	private refreshAndRetry(
		request: HttpRequest<unknown>,
		next: HttpHandler,
		error?: HttpErrorResponse
	) {
		return this.authService.refreshSession().pipe(
			switchMap((refreshed) => {
				if (refreshed.ok && refreshed.data) {
					const requestWithRefreshedToken = this.addTokenToRequest(
						request,
						refreshed.data?.sessionJwt
					);
					return next.handle(requestWithRefreshedToken);
				} else {
					return throwError(
						() => error ?? new Error('Could not refresh session!')
					);
				}
			})
		);
	}

	private shouldIntercept(request: HttpRequest<unknown>): boolean {
		return (
			this.pathsToIntercept.length === 0 ||
			this.pathsToIntercept.some((path) => request.url.includes(path))
		);
	}

	private addTokenToRequest(
		request: HttpRequest<unknown>,
		token: string
	): HttpRequest<unknown> {
		return request.clone({
			setHeaders: {
				Authorization: `Bearer ${token}`
			}
		});
	}
}
