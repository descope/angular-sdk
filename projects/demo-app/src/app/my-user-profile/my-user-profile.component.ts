import { Component } from '@angular/core';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Component({
	selector: 'app-my-user-profile',
	templateUrl: './my-user-profile.component.html'
})
export class MyUserProfileComponent {
	theme = (environment.descopeTheme as 'light' | 'dark' | 'os') ?? 'os';
	debugMode = environment.descopeDebugMode ?? false;

	constructor(private _: Router) {}
}
