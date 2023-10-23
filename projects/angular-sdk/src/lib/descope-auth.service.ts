import { Injectable } from '@angular/core';
import { DescopeAuthConfig } from './descope-auth.module';
import type { UserResponse } from '@descope/web-js-sdk';
import createSdk from '@descope/web-js-sdk';
import { BehaviorSubject, finalize, from, Observable, tap } from 'rxjs';

type DescopeSDK = ReturnType<typeof createSdk>;

type Observablefied<T> = {
	[K in keyof T]: T[K] extends (...args: infer Args) => Promise<infer R>
		? (...args: Args) => Observable<R>
		: T[K] extends (...args: infer Args) => infer R
		? (...args: Args) => R
		: T[K] extends object
		? Observablefied<T[K]>
		: T[K];
};

type AngularDescopeSDK = Observablefied<DescopeSDK>;

function makeObservable<T>(value: T): Observablefied<T> {
	const observableValue: any = {};

	for (const key in value) {
		if (typeof value[key] === 'function') {
			const fn = value[key] as Function;
			observableValue[key] = (...args: unknown[]) => {
				const fnResult = fn(...args);
				if (fnResult instanceof Promise) {
					return from(fnResult);
				} else {
					return fnResult;
				}
			};
		} else if (typeof value[key] === 'object' && value[key] !== null) {
			observableValue[key] = makeObservable(value[key]);
		} else {
			observableValue[key] = value[key];
		}
	}

	return observableValue as Observablefied<T>;
}

export interface DescopeSession {
	isAuthenticated: boolean;
	isSessionLoading: boolean;
	sessionToken: string | null;
}

export type DescopeUser = { user: UserResponse; isUserLoading: boolean };

@Injectable({
	providedIn: 'root'
})
export class DescopeAuthService {
	public sdk: AngularDescopeSDK;
	private readonly sessionSubject: BehaviorSubject<DescopeSession>;
	private readonly userSubject: BehaviorSubject<DescopeUser>;
	readonly descopeSession$: Observable<DescopeSession>;
	readonly descopeUser$: Observable<DescopeUser>;

	private readonly EMPTY_USER = {
		loginIds: [],
		userId: '',
		createTime: 0,
		TOTP: false,
		SAML: false
	};

	constructor(config: DescopeAuthConfig) {
		this.sdk = makeObservable<DescopeSDK>(
			createSdk({
				...config,
				persistTokens: true,
				autoRefresh: true
			})
		);
		this.sdk.onSessionTokenChange(this.setSession.bind(this));
		this.sdk.onUserChange(this.setUser.bind(this));
		this.sessionSubject = new BehaviorSubject<DescopeSession>({
			isAuthenticated: false,
			isSessionLoading: false,
			sessionToken: ''
		});
		this.descopeSession$ = this.sessionSubject.asObservable();
		this.userSubject = new BehaviorSubject<DescopeUser>({
			isUserLoading: false,
			user: this.EMPTY_USER
		});
		this.descopeUser$ = this.userSubject.asObservable();
	}

	refreshSession() {
		const beforeRefreshSession = this.sessionSubject.value;
		this.sessionSubject.next({
			...beforeRefreshSession,
			isSessionLoading: true
		});
		return this.sdk.refresh().pipe(
			tap((data) => {
				const afterRequestSession = this.sessionSubject.value;
				if (data.ok && data.data) {
					this.sessionSubject.next({
						...afterRequestSession,
						sessionToken: data.data.sessionJwt,
						isAuthenticated: !!data.data.sessionJwt
					});
				} else {
					this.sessionSubject.next({
						...afterRequestSession,
						sessionToken: '',
						isAuthenticated: false
					});
				}
			}),
			finalize(() => {
				const afterRefreshSession = this.sessionSubject.value;
				this.sessionSubject.next({
					...afterRefreshSession,
					isSessionLoading: false
				});
			})
		);
	}

	refreshUser() {
		const beforeRefreshUser = this.userSubject.value;
		this.userSubject.next({
			...beforeRefreshUser,
			isUserLoading: true
		});
		return this.sdk.me().pipe(
			tap((data) => {
				const afterRequestUser = this.userSubject.value;
				console.log(data);
				if (data.data) {
					this.userSubject.next({
						...afterRequestUser,
						user: {
							...data.data
						}
					});
				} else {
					this.userSubject.next({
						...afterRequestUser,
						user: this.EMPTY_USER
					});
				}
			}),
			finalize(() => {
				const afterRefreshUser = this.userSubject.value;
				this.userSubject.next({
					...afterRefreshUser,
					isUserLoading: false
				});
			})
		);
	}

	getSessionToken() {
		return this.sessionSubject.value.sessionToken;
	}

	isAuthenticated() {
		return this.sessionSubject.value.isAuthenticated;
	}

	private setSession(sessionToken: string | null) {
		const currentSession = this.sessionSubject.value;
		this.sessionSubject.next({
			sessionToken,
			isAuthenticated: !!sessionToken,
			isSessionLoading: currentSession.isSessionLoading
		});
	}

	private setUser(user: UserResponse) {
		const currentUser = this.userSubject.value;
		this.userSubject.next({
			isUserLoading: currentUser.isUserLoading,
			user
		});
	}
}
