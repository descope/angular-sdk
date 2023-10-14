import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DescopeAuthModule } from '../../../angular-sdk/src/lib/descope-auth.module';
import { HomeComponent } from './home/home.component';
import { ProtectedComponent } from './protected/protected.component';

@NgModule({
	declarations: [AppComponent, HomeComponent, ProtectedComponent],
	imports: [
		BrowserModule,
		AppRoutingModule,
		DescopeAuthModule.forRoot({ projectId: 'P2WZqcc8uZQlTMOpxw94BZo7JbXH' })
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule {}
