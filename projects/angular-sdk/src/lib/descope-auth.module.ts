import {
	CUSTOM_ELEMENTS_SCHEMA,
	ModuleWithProviders,
	NgModule,
	Optional,
	SkipSelf
} from '@angular/core';
import { DescopeComponent } from './descope/descope.component';

export class DescopeAuthConfig {
	projectId = '';
	baseUrl?: string;
	sessionTokenViaCookie?: boolean
}

@NgModule({
	imports: [],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	exports: [DescopeComponent],
	declarations: [DescopeComponent]
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
