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
import { LoginComponent } from './login/login.component';
import {
	HTTP_INTERCEPTORS,
	HttpClientModule,
	provideHttpClient,
	withInterceptors
} from '@angular/common/http';
import { DescopeAuthConfig, descopeInterceptor } from 'angular-sdk';

export function initializeApp(authService: DescopeAuthService) {
	return () => zip([authService.refreshSession(), authService.refreshUser()]);
}

@NgModule({
	declarations: [
		AppComponent,
		HomeComponent,
		ProtectedComponent,
		LoginComponent
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		HttpClientModule,
		DescopeAuthModule.forRoot({
      projectId: environment.descopeProjectId,
      baseUrl: environment.descopeBaseUrl || '',
      sessionTokenViaCookie: false
    })
	],
	providers: [
		{
			provide: DescopeAuthConfig,
			useValue: {
				projectId: environment.descopeProjectId,
				baseUrl: environment.descopeBaseUrl || '',
				sessionTokenViaCookie: false
			}
		},
		// {
		// 	provide: APP_INITIALIZER,
		// 	useFactory: initializeApp,
		// 	deps: [DescopeAuthService],
		// 	multi: true
		// },
		provideHttpClient(withInterceptors([descopeInterceptor]))
	],
	bootstrap: [AppComponent]
})
export class AppModule {}
