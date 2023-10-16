import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {ProtectedComponent} from "./protected/protected.component";
import {descopeAuthGuard} from "../../../angular-sdk/src/lib/descope-auth.guard";

const routes: Routes = [
  { path: 'protected', component: ProtectedComponent, canActivate: [descopeAuthGuard] },
  { path: '**', component: HomeComponent }
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule {}
