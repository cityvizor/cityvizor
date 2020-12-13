import { Routes, RouterModule } from '@angular/router';

import { ACLService } from "./services/acl.service";
import { NgModule } from '@angular/core';

import { FrontpageComponent } from './views/frontpage/frontpage.component';
import { NotFoundPageComponent } from './views/not-found-page/not-found-page.component';

const routes: Routes = [

	/* FRONT PAGE */
	{ path: '', component: FrontpageComponent },

	/* NOT FOUND */
	{ path: 'not-found', component: NotFoundPageComponent },

	/* COUNTERPARTIES */
	{ path: 'dodavatele', loadChildren: () => import("./views/counterparty/counterparty.module").then(mod => mod.CounterpartyModule) },

	/* ADMIN */
	{ path: 'admin', loadChildren: () => import('./views/admin/admin.module').then(mod => mod.AdminModule), canActivate: [ACLService] },

	/* PROFILE */
	{ path: ':profile', loadChildren: () => import('./views/profile/profile.module').then(mod => mod.ProfileModule) },

	/* CATCH ALL */
	{ path: '**', pathMatch: 'full', redirectTo: '/not-found' },


];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }