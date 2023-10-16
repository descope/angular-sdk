import {Injectable, Optional} from '@angular/core';
import {DescopeAuthConfig} from "./descope-auth.module";
import createSdk from "@descope/web-js-sdk";
import {from, map, Observable} from "rxjs";

@Injectable({
	providedIn: 'root'
})
export class DescopeAuthService {

  private sdk: any;

  constructor(@Optional() config?: DescopeAuthConfig) {
    if (config) {
      this.sdk = createSdk({
        ...config,
        persistTokens: true,
        autoRefresh: true
      })
      console.log(this.sdk);
    }
  }

  passwordSignUp(): Observable<any> {
    const user = {"name": "Joe Person", "phone": "+15555555555", "email": "email@company.com"};
    return from(this.sdk.password.signUp("piotr+angular@velocit.dev", "!QAZ2wsx", user))
  }

  passwordLogin(): Observable<any> {
    return from(this.sdk.password.signIn("piotr+angular@velocit.dev", "!QAZ2wsx"));
  }

  logout(): Observable<any> {
    return from(this.sdk.logout());
  }

  getSessionToken(): Observable<string> {
    return from<string>(this.sdk.getSessionToken());
  }
  isLoggedIn(): Observable<boolean> {
    return this.getSessionToken().pipe(
      map(token => token.length > 0)
    )

  }

}
