import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ILogger } from '@descope/web-component';
import { DescopeComponent } from '../descope/descope.component';
import { DescopeAuthConfig } from '../../types/types';

@Component({
	selector: 'descope-sign-up-flow',
	standalone: true,
	imports: [DescopeComponent],
	templateUrl: './sign-up-flow.component.html'
})
export class SignUpFlowComponent {
	projectId: string;

	@Input() locale: string;
	@Input() theme: 'light' | 'dark' | 'os';
	@Input() tenant: string;
	@Input() telemetryKey: string;
	@Input() redirectUrl: string;
	@Input() autoFocus: true | false | 'skipFirstScreen';

	@Input() debug: boolean;
	@Input() errorTransformer: (error: { text: string; type: string }) => string;
	@Input() logger: ILogger;

	@Output() success: EventEmitter<void> = new EventEmitter<void>();
	@Output() error: EventEmitter<void> = new EventEmitter<void>();

	constructor(descopeConfig: DescopeAuthConfig) {
		this.projectId = descopeConfig.projectId;
	}
}
