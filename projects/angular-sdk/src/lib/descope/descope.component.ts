import {
	Component,
	ElementRef,
	EventEmitter,
	Input,
	OnChanges,
	Output
} from '@angular/core';
import DescopeWebComponent from '@descope/web-component';
import DescopeWc, { ILogger } from '@descope/web-component';
import { DescopeAuthService } from '../descope-auth.service';
import { from } from 'rxjs';
import { baseHeaders } from '../constants';

@Component({
	selector: 'descope[projectId][flowId]',
	template: ''
})
export class DescopeComponent implements OnChanges {
	@Input() projectId: string;
	@Input() flowId: string;

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

	constructor(
		private elementRef: ElementRef,
		private authService: DescopeAuthService
	) {}

	ngOnChanges(): void {
		this.setupWebComponent();
	}

	private setupWebComponent() {
		const webComponent = new DescopeWebComponent();
		DescopeWc.sdkConfigOverrides = { baseHeaders };
		webComponent.setAttribute('project-id', this.projectId);
		webComponent.setAttribute('flow-id', this.flowId);
		if (this.locale) {
			webComponent.setAttribute('locale', this.locale);
		}
		if (this.theme) {
			webComponent.setAttribute('theme', this.theme);
		}
		if (this.tenant) {
			webComponent.setAttribute('tenant', this.tenant);
		}
		if (this.telemetryKey) {
			webComponent.setAttribute('telemetryKey', this.telemetryKey);
		}
		if (this.redirectUrl) {
			webComponent.setAttribute('redirect-url', this.redirectUrl);
		}
		if (this.autoFocus) {
			webComponent.setAttribute('auto-focus', this.autoFocus.toString());
		}
		if (this.debug) {
			webComponent.setAttribute('debug', this.debug.toString());
		}

		if (this.errorTransformer) {
			webComponent.errorTransformer = this.errorTransformer;
		}

		if (this.logger) {
			webComponent.logger = this.logger;
		}

		if (this.success) {
			webComponent.addEventListener('success', () => {
				from(
					this.authService.sdk.httpClient.hooks?.afterRequest!(
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						{} as any,
						new Response(JSON.stringify({}))
					) as Promise<unknown>
				).subscribe(() => {
					this.success?.emit();
				});
			});
		}

		if (this.error) {
			webComponent.addEventListener('error', () => {
				this.error?.emit();
			});
		}

		const nativeElement = this.elementRef.nativeElement;
		while (nativeElement.lastElementChild) {
			nativeElement.removeChild(nativeElement.lastElementChild);
		}
		nativeElement.appendChild(webComponent);
	}
}
