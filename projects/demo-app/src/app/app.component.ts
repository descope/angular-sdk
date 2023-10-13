import { Component } from '@angular/core';
import {DescopeAuthService} from "../../../angular-sdk/src/lib/descope-auth.service";

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {
	title = 'demo-app';

  constructor(private authService: DescopeAuthService) {
  }

  signUp() {
    this.authService.passwordSignUp().then(data => {
      console.log(data);
    }).catch(err => console.log(err));
  }


}
