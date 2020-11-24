import { Routes, RouterModule } from '@angular/router';

import { ACLService } from "./services/acl.service";
import { NgModule } from '@angular/core';

import { FrontpageComponent } from './views/frontpage/frontpage.component';

const routes: Routes = [

	/* FRONT PAGE */
	{ path: '', component: FrontpageComponent },

	/* COUNTERPARTIES */
	{ path: 'dodavatele', loadChildren: () => import("./views/counterparty/counterparty.module").then(mod => mod.CounterpartyModule) },

	/* ADMIN */
	{ path: 'admin', loadChildren: () => import('./views/admin/admin.module').then(mod => mod.AdminModule), canActivate: [ACLService] },

	/* PROFILE */
	{ path: ':profile', loadChildren: () => import('./views/profile/profile.module').then(mod => mod.ProfileModule) }

];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }