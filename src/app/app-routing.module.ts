import { Routes, RouterModule } from '@angular/router';

import { FrontPageComponent } from './views/front-page/front-page.component';

import { ProfileViewComponent } from './views/profile-view/profile-view.component';
import { ProfileAdminComponent } from './views/profile-admin/profile-admin.component';

import { CounterpartyViewComponent } from './views/counterparty-view/counterparty-view.component';
import { CounterpartyViewProfilesComponent } from './views/counterparty-view/counterparty-view-profiles/counterparty-view-profiles.component';

import { SiteAdminComponent } from './views/site-admin/site-admin.component';
import { UserAdminComponent } from './views/user-admin/user-admin.component';

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
	{
    path: 'dodavatele/:counterparty',
    component: CounterpartyViewComponent,
    children: [
      { path: 'obce', component: CounterpartyViewProfilesComponent },
      { path: 'faktury', component: CounterpartyViewProfilesComponent },
      { path: '', redirectTo: 'obce', pathMatch: 'full'}
    ]
  },
  
	/* PROFILES */
	
	/* backwards compatibility */
	{path: 'profil/:profile/admin/:module', redirectTo: ':profile/admin/:module', pathMatch: 'full'},
	{path: 'profil/:profile/admin', redirectTo: ':profile/admin', pathMatch: 'full'},
	
	{path: 'profil/:profile/:module', redirectTo: ':profile/:module', pathMatch: 'full'},
	{path: 'profil/:profile', redirectTo: ':profile', pathMatch: 'full'},
	
	/* current setting */
	{path: ':profile/admin/:module',component: ProfileAdminComponent},
	{path: ':profile/admin', redirectTo: ':profile/admin/uvod', pathMatch: 'full'},
	
	{path: ':profile/:module',component: ProfileViewComponent },
	{path: ':profile', redirectTo: ':profile/prehled', pathMatch: 'full'},
];

export const routing = RouterModule.forRoot(appRoutes);