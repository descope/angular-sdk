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

@Injectable()
export class DescopeInterceptor implements HttpInterceptor {
	constructor(private authService: DescopeAuthService) {}

	private pathsToIntercept: string[] = [];

	setPathsToIntercept(paths: string[]) {
		this.pathsToIntercept = paths;
	}

	intercept(
		request: HttpRequest<unknown>,
		next: HttpHandler
	): Observable<HttpEvent<unknown>> {
		if (this.shouldIntercept(request)) {
			return next.handle(request).pipe(
				catchError((error: HttpErrorResponse) => {
					if (error.status === 401 || error.status === 403) {
						return this.authService.refreshSession().pipe(
							switchMap((refreshed) => {
								if (refreshed) {
									// If session refreshed, retry the initial request
									return next.handle(request);
								} else {
									// If session refresh fails, propagate the initial error
									return throwError(() => error);
								}
							})
						);
					} else {
						return throwError(() => error);
					}
				})
			);
		} else {
			return next.handle(request);
		}
	}

	private shouldIntercept(request: HttpRequest<unknown>): boolean {
		return this.pathsToIntercept.length === 0 || this.pathsToIntercept.some((path) => request.url.includes(path));
	}
}
