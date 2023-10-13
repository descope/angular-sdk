import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DescopeAuthModule } from '../../../angular-sdk/src/lib/descope-auth.module';

@NgModule({
	declarations: [AppComponent],
	imports: [BrowserModule, AppRoutingModule, DescopeAuthModule.forRoot({projectId: "<test>"})],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule {}
