import { Injectable } from '@angular/core';
import { DescopeAuthConfig } from './descope-auth.module';
import createSdk from '@descope/web-js-sdk';
import { BehaviorSubject, finalize, from, Observable } from 'rxjs';

type DescopeSDK = ReturnType<typeof createSdk>;

interface DescopeSession {
	isAuthenticated: boolean;
	isSessionLoading: boolean;
	sessionToken: string | null;
}

@Injectable({
	providedIn: 'root'
})
export class DescopeAuthService {
	private sdk: DescopeSDK;
	private readonly sessionSubject: BehaviorSubject<DescopeSession>;
	readonly descopeSession$: Observable<DescopeSession>;


	constructor(config: DescopeAuthConfig) {
		this.sdk = createSdk({
			...config,
			persistTokens: true,
			autoRefresh: true
		});
		this.sdk.onSessionTokenChange(this.setSession.bind(this));
		this.sessionSubject = new BehaviorSubject<DescopeSession>({
			isAuthenticated: false,
			isSessionLoading: false,
			sessionToken: ''
		})
		this.descopeSession$ = this.sessionSubject.asObservable();
	}

	private setSession(sessionToken: string | null) {
		const currentSession = this.sessionSubject.value;
		this.sessionSubject.next({
			sessionToken,
			isAuthenticated: !!sessionToken,
			isSessionLoading: currentSession.isSessionLoading
		})
	}

	passwordSignUp() {
		const user = {
			name: 'Joe Person',
			phone: '+15555555555',
			email: 'email@company.com'
		};
		return from(
			this.sdk.password.signUp('piotr+angular@velocit.dev', '!QAZ2wsx', user)
		);
	}

	passwordLogin() {
		return from(this.sdk.password.signIn('piotr+angular@velocit.dev', '!QAZ2wsx'));
	}

	logout() {
		return from(this.sdk.logout());
	}

	refreshSession() {
		const beforeRefreshSession = this.sessionSubject.value;
		this.sessionSubject.next({ ...beforeRefreshSession, isSessionLoading: true });
		return from(this.sdk.refresh()).pipe(
			finalize(() => {
				const afterRefreshSession = this.sessionSubject.value;
				this.sessionSubject.next({ ...afterRefreshSession, isSessionLoading: false });
			})
		);
	}

	getSessionToken() {
		return this.sessionSubject.value.sessionToken;
	}

	isAuthenticated() {
		return this.sessionSubject.value.isAuthenticated;
	}
}
