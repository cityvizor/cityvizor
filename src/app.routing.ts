import { Routes, RouterModule } from '@angular/router';

import { FrontPageComponent } from './views/front-page/front-page.component';
import { ProfileAdminComponent } from './views/profile-admin/profile-admin.component';
import { ProfileViewComponent } from './views/profile-view/profile-view.component';
import { SiteAdminComponent } from './views/site-admin/site-admin.component';
import { ServiceDeskComponent } from './views/service-desk/service-desk.component';

const appRoutes: Routes = [
  {path: '',component: FrontPageComponent},

	{path: 'profil/:profile/admin/:module',component: ProfileAdminComponent},
	{path: 'profil/:profile/admin', redirectTo: 'profil/:profile/admin/uvod', pathMatch: 'full'},
	
	{path: 'profil/:profile/:module',component: ProfileViewComponent},
	{path: 'profil/:profile', redirectTo: 'profil/:profile/prehled', pathMatch: 'full'},
	
	{path: 'admin/:cat',component: SiteAdminComponent},
	{path: 'admin', redirectTo: 'admin/profily', pathMatch: 'full'},
	
	{path: 'service-desk/:cat',component: ServiceDeskComponent},
	{path: 'service-desk', redirectTo: 'service-desk/ucet', pathMatch: 'full'}
];

export const routing = RouterModule.forRoot(appRoutes);