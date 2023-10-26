import { Component } from '@angular/core';
import { DescopeAuthService } from '../../../../angular-sdk/src/lib/descope-auth.service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss']
})
export class HomeComponent {
	projectId: string = environment.descopeProjectId;
	theme: 'light' | 'dark' = 'light';

	constructor(
		private router: Router,
		private authService: DescopeAuthService
	) {}

	signUp() {
		const user = {
			name: 'Joe Person',
			phone: '+15555555555',
			email: 'email@company.com'
		};

		this.authService.sdk.password
			.signUp('piotr+angular@velocit.dev', '!QAZ2wsx', user)
			.subscribe((resp) => {
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
		this.authService.sdk.password
			.signIn('piotr+angular@velocit.dev', '!QAZ2wsx')
			.subscribe((resp) => {
				if (!resp.ok) {
					console.log('Failed to sign in via password');
					console.log('Status Code: ' + resp.code);
					console.log('Error Code: ' + resp.error?.errorCode);
					console.log('Error Description: ' + resp.error?.errorDescription);
					console.log('Error Message: ' + resp.error?.errorMessage);
				} else {
					console.log('Successfully signed in via password');
					console.log(resp);
					this.router
						.navigate(['/protected'])
						.catch((err) => console.error(err));
				}
			});
	}

	onSuccess() {
		console.log('SUCCESSFULLY LOGGED IN FROM WEB COMPONENT');
		this.router.navigate(['/protected']).catch((err) => console.error(err));
	}

	onError() {
		console.log('ERROR FROM LOG IN FLOW FROM WEB COMPONENT');
	}

	changeTheme(theme: 'light' | 'dark') {
		this.theme = theme;
	}
}
