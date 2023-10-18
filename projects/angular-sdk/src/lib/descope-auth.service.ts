import { Injectable } from '@angular/core';
import { DescopeAuthConfig } from './descope-auth.module';
import createSdk from '@descope/web-js-sdk';
import { from } from 'rxjs';

type DescopeSDK = ReturnType<typeof createSdk>;

@Injectable({
	providedIn: 'root'
})
export class DescopeAuthService {
	private sdk: DescopeSDK

	constructor(config: DescopeAuthConfig) {
			this.sdk = createSdk({
				...config,
				persistTokens: true,
				autoRefresh: true
			});
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

	passwordLogin(){
		return from(
			this.sdk.password.signIn('piotr+angular@velocit.dev', '!QAZ2wsx')
		);
	}

	logout() {
		return from(this.sdk.logout());
	}

	refreshSession() {
		return from(this.sdk.refresh());
	}

	getSessionToken() {
    return "";
	}
	isLoggedIn(): boolean {
		return this.getSessionToken().length > 0;
	}
}
