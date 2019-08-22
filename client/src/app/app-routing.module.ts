import { Routes, RouterModule } from '@angular/router';

import { FrontPageComponent } from './views/front-page/front-page.component';

import { SiteAdminComponent } from './views/site-admin/site-admin.component';

import { UserAdminComponent } from './views/user-admin/user-admin.component';

import { ACLService } from "./services/acl.service";

const appRoutes: Routes = [
	{ path: '', component: FrontPageComponent },

	/* ADMINISTRATION */

	{ path: 'admin/:cat', component: SiteAdminComponent, canActivate: [ACLService] },
	{ path: 'admin', redirectTo: 'admin/profily', pathMatch: 'full' },

	/* USER ACCOUNT */

	{ path: 'ucet/:cat', component: UserAdminComponent },
	{ path: 'ucet', redirectTo: 'ucet/nastaveni', pathMatch: 'full' },

	/* COUNTERPARTIES */
	{
		path: 'dodavatele',
		loadChildren: () => import("./views/counterparty/counterparty.module").then(mod => mod.CounterpartyModule) 
	},

	/* PROFILES */
	
	{
		path: ':profile',
		loadChildren: () => import('./views/profile/profile.module').then(mod => mod.ProfileViewModule)
	}	
];

export const routing = RouterModule.forRoot(appRoutes);