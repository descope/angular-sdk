import { Component, ElementRef, Input, OnChanges, OnInit } from '@angular/core';
import DescopeAccessKeyManagementWidget from '@descope/access-key-management-widget';
import { ILogger } from '@descope/web-component';
import { DescopeAuthConfig } from '../../types/types';

@Component({
	selector: 'access-key-management[tenant]',
	standalone: true,
	template: ''
})
export class AccessKeyManagementComponent implements OnInit, OnChanges {
	projectId: string;
	baseUrl?: string;
	@Input() tenant: string;
	@Input() widgetId: string;

	@Input() theme: 'light' | 'dark' | 'os';
	@Input() debug: boolean;
	@Input() logger: ILogger;

	private readonly webComponent = new DescopeAccessKeyManagementWidget();

	constructor(
		private elementRef: ElementRef,
		descopeConfig: DescopeAuthConfig
	) {
		this.projectId = descopeConfig.projectId;
		this.baseUrl = descopeConfig.baseUrl;
	}

	ngOnInit() {
		this.setupWebComponent();
		this.elementRef.nativeElement.appendChild(this.webComponent);
	}

	ngOnChanges(): void {
		this.setupWebComponent();
	}

	private setupWebComponent() {
		this.webComponent.setAttribute('project-id', this.projectId);
		this.webComponent.setAttribute('tenant', this.tenant);
		this.webComponent.setAttribute('widget-id', this.widgetId);
		if (this.baseUrl) {
			this.webComponent.setAttribute('base-url', this.baseUrl);
		}
		if (this.theme) {
			this.webComponent.setAttribute('theme', this.theme);
		}
		if (this.debug) {
			this.webComponent.setAttribute('debug', this.debug.toString());
		}

		if (this.logger) {
			(this.webComponent as any).logger = this.logger;
		}
	}
}