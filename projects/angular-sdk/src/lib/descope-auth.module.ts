import {ModuleWithProviders, NgModule, Optional, SkipSelf} from '@angular/core';
import { AngularSdkComponent } from './angular-sdk.component';
import createSdk from '@descope/web-js-sdk';

export class DescopeAuthConfig {
  projectId = '';
}

@NgModule({
	declarations: [AngularSdkComponent],
	imports: [],
	exports: [AngularSdkComponent]
})
export class DescopeAuthModule {

  constructor(@Optional() @SkipSelf() parentModule?: DescopeAuthModule) {
    if (parentModule) {
      throw new Error(
        'DescopeAuthModule is already loaded. Import it only once');
    }
  }
  static forRoot(config?: DescopeAuthConfig): ModuleWithProviders<DescopeAuthModule> {
    return {
      ngModule: DescopeAuthModule,
      providers: [
        { provide: DescopeAuthConfig, useValue: config },
      ]
    };
  }
  // const sdk = createSdk({
  //   ...config,
  //   persistTokens: true,
  //   autoRefresh: true
  // });
}
