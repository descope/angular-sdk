import {
	ModuleWithProviders,
	NgModule,
	Optional,
	SkipSelf
} from '@angular/core';

export class DescopeAuthConfig {
	projectId = '';
}

@NgModule({
	imports: [],
	exports: []
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
