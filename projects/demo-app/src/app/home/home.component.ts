import { Component } from '@angular/core';
import { DescopeAuthService } from '../../../../angular-sdk/src/lib/descope-auth.service';
import { Router } from '@angular/router';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss']
})
export class HomeComponent {
	constructor(
		private router: Router,
		private authService: DescopeAuthService
	) {}

	signUp() {
		this.authService.passwordSignUp().subscribe((resp) => {
			if (!resp.ok) {
				console.log('Failed to sign up via password');
				console.log('Status Code: ' + resp.code);
				console.log('Error Code: ' + resp.error?.errorCode);
				console.log('Error Description: ' + resp.error?.errorDescription);
				console.log('Error Message: ' + resp.error?.errorMessage);
			} else {
				console.log('Successfully signed up via password');
				console.log(resp);
			}
		});
	}

	login() {
		this.authService.passwordLogin().subscribe((resp) => {
			if (!resp.ok) {
				console.log('Failed to sign in via password');
				console.log('Status Code: ' + resp.code);
				console.log('Error Code: ' + resp.error?.errorCode);
				console.log('Error Description: ' + resp.error?.errorDescription);
				console.log('Error Message: ' + resp.error?.errorMessage);
			} else {
				console.log('Successfully signed in via password');
				console.log(resp);
				this.router.navigate(['/protected']).catch((err) => console.error(err));
			}
		});
	}
}
