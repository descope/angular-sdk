import {Component, OnInit} from '@angular/core';
import {DescopeAuthService, DescopeSession} from '../../../../angular-sdk/src/lib/services/descope-auth.service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import {Observable} from "rxjs";

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
	projectId: string = environment.descopeProjectId;
  isAuthenticated: boolean = false;
  roles: string[] = [];
  userName: string = '';

	constructor(
		private router: Router,
		private authService: DescopeAuthService
	) {}

	ngOnInit() {
    this.authService.descopeSession$.subscribe(session => {
      this.isAuthenticated = session.isAuthenticated;
      if (session.sessionToken) {
        this.roles = this.authService.getJwtRoles(session.sessionToken)
      }
    })
    this.authService.descopeUser$.subscribe(descopeUser => {
      if (descopeUser.user) {
        this.userName = descopeUser.user.name ?? '';
      }
    })
  }


	login() {
		this.router.navigate(['/login']).catch((err) => console.error(err));
	}

  logout() {
    this.authService.sdk.logout();
  }
}
