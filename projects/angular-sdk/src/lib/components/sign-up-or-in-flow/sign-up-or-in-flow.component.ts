import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ILogger } from '@descope/web-component';
import { DescopeComponent } from '../descope/descope.component';
import { DescopeAuthConfig } from '../../types/types';

@Component({
	selector: 'descope-sign-up-or-in-flow',
	standalone: true,
	imports: [DescopeComponent],
	templateUrl: './sign-up-or-in-flow.component.html'
})
export class SignUpOrInFlowComponent {
	projectId: string;

	@Input() locale: string;
	@Input() theme: 'light' | 'dark' | 'os';
	@Input() tenant: string;
	@Input() telemetryKey: string;
	@Input() redirectUrl: string;
	@Input() autoFocus: true | false | 'skipFirstScreen';
	@Input() validateOnBlur: boolean;

	@Input() debug: boolean;
	@Input() errorTransformer: (error: { text: string; type: string }) => string;
	@Input() client: Record<string, any>;
	@Input() form: Record<string, any>;
	@Input() logger: ILogger;

	@Output() success: EventEmitter<CustomEvent> =
		new EventEmitter<CustomEvent>();
	@Output() error: EventEmitter<CustomEvent> = new EventEmitter<CustomEvent>();

	constructor(descopeConfig: DescopeAuthConfig) {
		this.projectId = descopeConfig.projectId;
	}
}
