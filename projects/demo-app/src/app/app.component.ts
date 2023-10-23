import { Component, OnInit } from '@angular/core';
import {
	DescopeAuthService,
	DescopeSession,
	DescopeUser
} from '../../../angular-sdk/src/lib/descope-auth.service';
import { Observable, of, tap } from 'rxjs';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
	constructor(private authService: DescopeAuthService) {}

	session$: Observable<DescopeSession> = of({
		isAuthenticated: false,
		isSessionLoading: false,
		sessionToken: ''
	});

	user$: Observable<DescopeUser> = of({
		isUserLoading: false,
		user: {
			loginIds: [],
			userId: '',
			createTime: 0,
			TOTP: false,
			SAML: false
		}
	});

	ngOnInit() {
		this.session$ = this.authService.descopeSession$.pipe(
			tap((value) => console.log(value))
		);
		this.user$ = this.authService.descopeUser$.pipe(
			tap((value) => console.log(value))
		);
	}

	refreshSession() {
		this.authService.refreshSession().subscribe((data) => console.log(data));
	}

	refreshUser() {
		this.authService.refreshUser().subscribe((data) => console.log(data));
	}
}
