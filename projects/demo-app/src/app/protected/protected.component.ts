import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
	selector: 'app-protected',
	templateUrl: './protected.component.html',
	styleUrls: ['./protected.component.scss']
})
export class ProtectedComponent {
	projectId: string = environment.descopeProjectId;
	flowId = environment.descopeStepUpFlowId ?? 'sign-up-or-in';
	theme = (environment.descopeTheme as 'light' | 'dark' | 'os') ?? 'os';
	telemetryKey = environment.descopeTelemetryKey ?? '';
	debugMode = environment.descopeDebugMode ?? false;
	tenantId = environment.descopeTenantId ?? '';
	locale = environment.descopeLocale ?? '';
	redirectUrl = environment.descopeRedirectUrl ?? '';

	stepUpSuccess = false;
	constructor(private router: Router) {}

	errorTransformer = (error: { text: string; type: string }): string => {
		const translationMap: { [key: string]: string } = {
			SAMLStartFailed: 'Failed to start SAML flow'
		};
		return translationMap[error.type] || error.text;
	};

	onSuccess() {
		this.stepUpSuccess = true;
	}

	onError() {
		console.log('ERROR FROM LOG IN FLOW FROM WEB COMPONENT');
	}

	goBack() {
		this.router.navigate(['/']).catch((err) => console.error(err));
	}
}
