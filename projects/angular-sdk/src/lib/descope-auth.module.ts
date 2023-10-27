import {
	CUSTOM_ELEMENTS_SCHEMA,
	ModuleWithProviders,
	NgModule,
	Optional,
	SkipSelf
} from '@angular/core';
import {DescopeComponent} from "./components/descope/descope.component";
import { SignInFlowComponent } from './components/sign-in-flow/sign-in-flow.component';
import { SignUpFlowComponent } from './components/sign-up-flow/sign-up-flow.component';
import { SignUpOrInFlowComponent } from './components/sign-up-or-in-flow/sign-up-or-in-flow.component';
import { ILogger } from '@descope/web-component';

export class DescopeAuthConfig {
	projectId = '';
	baseUrl?: string;
	sessionTokenViaCookie?: boolean
}
export type { ILogger };


@NgModule({
	imports: [],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	exports: [DescopeComponent],
	declarations: [DescopeComponent, SignInFlowComponent, SignUpFlowComponent, SignUpOrInFlowComponent]
})
export class DescopeAuthModule {
	constructor(@Optional() @SkipSelf() parentModule?: DescopeAuthModule) {
		if (parentModule) {
			throw new Error(
				'DescopeAuthModule is already loaded. Import it only once'
			);
		}
	}

	static forRoot(
		config?: DescopeAuthConfig
	): ModuleWithProviders<DescopeAuthModule> {
		return {
			ngModule: DescopeAuthModule,
			providers: [{ provide: DescopeAuthConfig, useValue: config }]
		};
	}
}
