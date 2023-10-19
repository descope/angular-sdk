import { Component, OnInit } from '@angular/core';
import {DescopeAuthService, DescopeSession} from '../../../angular-sdk/src/lib/descope-auth.service';
import {map, Observable, of, tap} from "rxjs";

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
	})

	ngOnInit() {
		this.session$ = this.authService.descopeSession$.pipe(
			tap(value => console.log(value))
		)
	}
}
