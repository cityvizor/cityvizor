import { Routes, RouterModule } from '@angular/router';

import { FrontPageComponent } from './views/front-page/front-page.component';
import { ProfileAdminComponent } from './views/profile-admin/profile-admin.component';
import { ProfileViewComponent } from './views/profile-view/profile-view.component';
import { SiteAdminComponent } from './views/site-admin/site-admin.component';
import { UserAdminComponent } from './views/user-admin/user-admin.component';
import { CounterpartyViewComponent } from "./views/counterparty-view/counterparty-view.component";

import { ACLService } from "./services/acl.service";

const appRoutes: Routes = [
  {path: '',component: FrontPageComponent},
	
	/* ADMINISTRATION */
	
	{path: 'admin/:cat',component: SiteAdminComponent, canActivate: [ACLService]},
	{path: 'admin', redirectTo: 'admin/profily', pathMatch: 'full'},
	
	/* USER ACCOUNT */
	
	{path: 'ucet/:cat',component: UserAdminComponent},
	{path: 'ucet', redirectTo: 'ucet/nastaveni', pathMatch: 'full'},
		
	/* COUNTERPARTIES */
	{path: 'dodavatel/:counterparty/:cat', component: CounterpartyViewComponent },
	{path: 'dodavatel/:counterparty', redirectTo: 'dodavatel/:counterparty/prehled', pathMatch: 'full' },
	
	/* PROFILES */
	
	/* backwards compatibility */
	{path: 'obec/:profile/admin/:module', redirectTo: ':profile/admin/:module', pathMatch: 'full'},
	{path: 'obec/:profile/admin', redirectTo: ':profile/admin', pathMatch: 'full'},
	
	{path: 'obec/:profile/:module', redirectTo: ':profile/:module', pathMatch: 'full'},
	{path: 'obec/:profile', redirectTo: ':profile', pathMatch: 'full'},
	
	/* current setting */
	{path: ':profile/admin/:module',component: ProfileAdminComponent },
	{path: ':profile/admin', redirectTo: ':profile/admin/uvod', pathMatch: 'full'},
	
	{path: ':profile/:module',component: ProfileViewComponent },
	{path: ':profile', redirectTo: ':profile/vydaje', pathMatch: 'full'},
];

export const routing = RouterModule.forRoot(appRoutes);