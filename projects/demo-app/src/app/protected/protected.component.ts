import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DescopeAuthService } from '../../../../angular-sdk/src/lib/services/descope-auth.service';

@Component({
	selector: 'app-protected',
	templateUrl: './protected.component.html',
	styleUrls: ['./protected.component.scss']
})
export class ProtectedComponent {
	constructor(
		private router: Router,
		private authService: DescopeAuthService
	) {}

	logout() {
		this.authService.sdk.logout().subscribe((resp) => {
			if (!resp.ok) {
				console.log('Failed to logout');
				console.log('Status Code: ' + resp.code);
				console.log('Error Code: ' + resp.error?.errorCode);
				console.log('Error Description: ' + resp.error?.errorDescription);
				console.log('Error Message: ' + resp.error?.errorMessage);
			} else {
				console.log('Successfully logout');
				console.log(resp);
				this.router.navigate(['/']).catch((err) => console.error(err));
			}
		});
	}
}
