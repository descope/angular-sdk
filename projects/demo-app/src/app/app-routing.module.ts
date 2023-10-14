import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {ProtectedComponent} from "./protected/protected.component";

const routes: Routes = [
  { path: 'protected', component: ProtectedComponent },
  { path: '**', component: HomeComponent }
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule {}
