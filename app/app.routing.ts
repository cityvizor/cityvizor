import { Routes, RouterModule } from '@angular/router';

import { FrontPageComponent } from './views/front-page/front-page.component';
import { PageViewComponent } from './views/page-view/page-view.component';
import { EntityListComponent } from './views/entity-list/entity-list.component';
import { EntityProfileComponent } from './views/entity-profile/entity-profile.component';
import { EntityAdminComponent } from './views/entity-admin/entity-admin.component';

const appRoutes: Routes = [
  {path: '',component: FrontPageComponent},
	
	{path: 'stranka/:id',component: PageViewComponent},

	{path: 'profil/:id/:module',component: EntityProfileComponent},
	{path: 'profil/:id', redirectTo: 'profil/:id/prehled'}
];

export const routing = RouterModule.forRoot(appRoutes);