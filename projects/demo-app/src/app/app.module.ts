import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DescopeAuthModule } from '../../../angular-sdk/src/lib/descope-auth.module';
import { HomeComponent } from './home/home.component';
import { ProtectedComponent } from './protected/protected.component';
import { environment } from '../environments/environment';
import { DescopeAuthService } from 'projects/angular-sdk/src/public-api';
import { zip } from 'rxjs';

export function initializeApp(authService: DescopeAuthService) {
	return () => zip([authService.refreshSession(), authService.refreshUser()]);
}

@NgModule({
	declarations: [AppComponent, HomeComponent, ProtectedComponent],
	imports: [
		BrowserModule,
		AppRoutingModule,
		DescopeAuthModule.forRoot({ projectId: environment.descopeProjectId })
	],
	providers: [
		{
			provide: APP_INITIALIZER,
			useFactory: initializeApp,
			deps: [DescopeAuthService],
			multi: true
		}
	],
	bootstrap: [AppComponent]
})
export class AppModule {}
