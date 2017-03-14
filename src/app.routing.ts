import { Routes, RouterModule } from '@angular/router';

import { FrontPageComponent } from './views/front-page/front-page.component';
import { PageViewComponent } from './views/page-view/page-view.component';
import { EntityListComponent } from './views/entity-list/entity-list.component';
import { EntityProfileComponent } from './views/entity-profile/entity-profile.component';
import { EntityAdminComponent } from './views/entity-admin/entity-admin.component';

const appRoutes: Routes = [
  {path: '',component: FrontPageComponent},
	
	{path: 'stranka/:id',component: PageViewComponent},

	{path: 'profil/:profile/admin/:module',component: EntityAdminComponent},
	{path: 'profil/:profile/admin', redirectTo: 'profil/:profile/admin/sprava-profilu'},
	
	{path: 'profil/:profile/:module',component: EntityProfileComponent},
	{path: 'profil/:profile', redirectTo: 'profil/:profile/prehled'}
];

export const routing = RouterModule.forRoot(appRoutes);