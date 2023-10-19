import { Component, OnInit } from '@angular/core';
import { DescopeAuthService } from '../../../angular-sdk/src/lib/descope-auth.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
	constructor(private authService: DescopeAuthService) {}

	ngOnInit() {
		this.authService.descopeSession$.subscribe((data) => {
			console.log(data);
		});
	}
}
