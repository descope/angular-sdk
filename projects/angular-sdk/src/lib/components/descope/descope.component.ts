import {
	Component,
	ElementRef,
	EventEmitter,
	Input,
	OnChanges,
	OnInit,
	Output
} from '@angular/core';
import DescopeWebComponent from '@descope/web-component';
import DescopeWc, { ILogger } from '@descope/web-component';
import { DescopeAuthService } from '../../services/descope-auth.service';
import { from } from 'rxjs';
import { baseHeaders } from '../../utils/constants';
import { DescopeAuthConfig } from '../../types/types';

@Component({
	selector: 'descope[flowId]',
	standalone: true,
	template: ''
})
export class DescopeComponent implements OnInit, OnChanges {
	projectId: string;
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

	private readonly webComponent: DescopeWebComponent =
		new DescopeWebComponent();

	constructor(
		private elementRef: ElementRef,
		private authService: DescopeAuthService,
		descopeConfig: DescopeAuthConfig
	) {
		this.projectId = descopeConfig.projectId;
	}

	ngOnInit() {
		DescopeWc.sdkConfigOverrides = { baseHeaders };
		this.setupWebComponent();
		this.elementRef.nativeElement.appendChild(this.webComponent);
	}

	ngOnChanges(): void {
		this.setupWebComponent();
	}

	private setupWebComponent() {
		this.webComponent.setAttribute('project-id', this.projectId);
		this.webComponent.setAttribute('flow-id', this.flowId);
		if (this.locale) {
			this.webComponent.setAttribute('locale', this.locale);
		}
		if (this.theme) {
			this.webComponent.setAttribute('theme', this.theme);
		}
		if (this.tenant) {
			this.webComponent.setAttribute('tenant', this.tenant);
		}
		if (this.telemetryKey) {
			this.webComponent.setAttribute('telemetryKey', this.telemetryKey);
		}
		if (this.redirectUrl) {
			this.webComponent.setAttribute('redirect-url', this.redirectUrl);
		}
		if (this.autoFocus) {
			this.webComponent.setAttribute('auto-focus', this.autoFocus.toString());
		}
		if (this.debug) {
			this.webComponent.setAttribute('debug', this.debug.toString());
		}

		if (this.errorTransformer) {
			this.webComponent.errorTransformer = this.errorTransformer;
		}

		if (this.logger) {
			this.webComponent.logger = this.logger;
		}

		if (this.success) {
			this.webComponent.addEventListener('success', (e: Event) => {
				from(
					this.authService.descopeSdk.httpClient.hooks?.afterRequest!(
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						{} as any,
						new Response(JSON.stringify((e as CustomEvent).detail))
					) as Promise<unknown>
				).subscribe(() => {
					this.success?.emit();
				});
			});
		}

		if (this.error) {
			this.webComponent.addEventListener('error', () => {
				this.error?.emit();
			});
		}
	}
}
