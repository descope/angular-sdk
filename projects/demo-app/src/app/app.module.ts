import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularSdkModule } from '../../../angular-sdk/src/lib/angular-sdk.module';

@NgModule({
	declarations: [AppComponent],
	imports: [BrowserModule, AppRoutingModule, AngularSdkModule],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule {}
