import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProtectedComponent } from './protected/protected.component';
import { descopeAuthGuard } from '../../../angular-sdk/src/lib/services/descope-auth.guard';
import { LoginComponent } from './login/login.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';

const routes: Routes = [
	{
		path: 'step-up',
		component: ProtectedComponent,
		canActivate: [descopeAuthGuard],
		data: { descopeFallbackUrl: '/' }
	},
	{ path: 'login', component: LoginComponent },
	{ path: 'manage-users', component: ManageUsersComponent },
	{ path: '**', component: HomeComponent }
];

@NgModule({
	imports: [RouterModule.forRoot(routes, { enableTracing: false })],
	exports: [RouterModule]
})
export class AppRoutingModule {}
