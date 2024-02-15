import {
	Component,
	ElementRef,
	EventEmitter,
	Input,
	OnChanges,
	OnInit,
	Output
} from '@angular/core';
import DescopeUserManagementWidget from '@descope/user-management-widget';
import { ILogger } from '@descope/web-component';
import { DescopeAuthConfig } from '../../types/types';

@Component({
	selector: 'user-management[tenant]',
	standalone: true,
	template: ''
})
export class UserManagementComponent implements OnInit, OnChanges {
	projectId: string;
	@Input() tenant: string;

	@Input() theme: 'light' | 'dark' | 'os';
	@Input() debug: boolean;
	@Input() logger: ILogger;

	@Output() success: EventEmitter<CustomEvent> =
		new EventEmitter<CustomEvent>();
	@Output() error: EventEmitter<CustomEvent> = new EventEmitter<CustomEvent>();

	private readonly webComponent = new DescopeUserManagementWidget();

	constructor(
		private elementRef: ElementRef,
		descopeConfig: DescopeAuthConfig
	) {
		this.projectId = descopeConfig.projectId;
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
