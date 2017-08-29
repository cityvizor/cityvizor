import { Routes, RouterModule } from '@angular/router';

import { FrontPageComponent } from './views/front-page/front-page.component';
import { ProfileAdminComponent } from './views/profile-admin/profile-admin.component';
import { ProfileViewComponent } from './views/profile-view/profile-view.component';
import { SiteAdminComponent } from './views/site-admin/site-admin.component';
import { UserAdminComponent } from './views/user-admin/user-admin.component';

const appRoutes: Routes = [
  {path: '',component: FrontPageComponent},
	
	/* ADMINISTRATION */
	
	{path: 'admin/:cat',component: SiteAdminComponent},
	{path: 'admin', redirectTo: 'admin/profily', pathMatch: 'full'},
	
	/* USER ACCOUNT */
	
	{path: 'ucet/:cat',component: UserAdminComponent},
	{path: 'ucet', redirectTo: 'nastaveni-uctu/ucet', pathMatch: 'full'},
	
	/* PROFILES */
	
	/* backwards compatibility */
	{path: 'profil/:profile/admin/:module', redirectTo: ':profile/admin/:module', pathMatch: 'full'},
	{path: 'profil/:profile/admin', redirectTo: ':profile/admin', pathMatch: 'full'},
	
	{path: 'profil/:profile/:module', redirectTo: ':profile/:module', pathMatch: 'full'},
	{path: 'profil/:profile', redirectTo: ':profile', pathMatch: 'full'},
	
	/* current setting */
	{path: ':profile/admin/:module',component: ProfileAdminComponent},
	{path: ':profile/admin', redirectTo: ':profile/admin/uvod', pathMatch: 'full'},
	
	{path: ':profile/:module',component: ProfileViewComponent},
	{path: ':profile', redirectTo: ':profile/prehled', pathMatch: 'full'},
];

export const routing = RouterModule.forRoot(appRoutes);