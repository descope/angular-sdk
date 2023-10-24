import {
	Component,
	ElementRef,
	EventEmitter,
	Input,
	OnInit,
	Output
} from '@angular/core';
import DescopeWebComponent from '@descope/web-component';
import { DescopeAuthService } from '../descope-auth.service';
import {from} from "rxjs";

@Component({
	selector: 'Descope',
	template: '',
})
export class DescopeComponent implements OnInit {
	@Input() projectId: string = '';
	@Output() onSuccess = new EventEmitter<void>();
	@Output() onError = new EventEmitter<void>();

	constructor(
		private elementRef: ElementRef,
		private authService: DescopeAuthService
	) {}

	ngOnInit() {
		const webComponent = new DescopeWebComponent();
		webComponent.setAttribute('project-id', this.projectId);
		webComponent.setAttribute('flow-id', 'sign-in');
		webComponent.addEventListener('success',  (e: any) => {
			from(this.authService.sdk.httpClient.hooks?.afterRequest!(
				{} as any,
				new Response(JSON.stringify(e.detail))
			) as Promise<unknown>).subscribe(() => {
				console.log("HOOKS SHOULD BE DONE, EMITING, SUCCESS OUTPUT")
				this.onSuccess.emit();
			})
		});
		webComponent.addEventListener('error', () => {
			this.onError.emit();
		});
		this.elementRef.nativeElement.appendChild(webComponent);
	}
}
