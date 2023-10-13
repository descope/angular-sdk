import {Injectable, Optional} from '@angular/core';
import {DescopeAuthConfig} from "./descope-auth.module";
import createSdk from "@descope/web-js-sdk";

@Injectable({
	providedIn: 'root'
})
export class DescopeAuthService {

  private sdk: any;

  constructor(@Optional() config?: DescopeAuthConfig) {
    console.log(config);
    if (config) {
      this.sdk = createSdk({
        ...config,
        persistTokens: true,
        autoRefresh: true
      })
    }
    console.log(this.sdk);
  }

  async passwordSignUp() {
    const user = {"name": "Joe Person", "phone": "+15555555555", "email": "email@company.com"};

    return this.sdk.password.signUp("piotr+angular@velocit.dev", "!QAZ2wsx", user)
  }

}
