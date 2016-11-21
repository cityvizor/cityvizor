import { Routes, RouterModule } from '@angular/router';

import { FrontPageComponent } from './views/front-page/front-page.component';
import { PageViewComponent } from './views/page-view/page-view.component';
import { EntityListComponent } from './views/entity-list/entity-list.component';
import { EntityProfileComponent } from './views/entity-profile/entity-profile.component';
import { EntityAdminComponent } from './views/entity-admin/entity-admin.component';

const appRoutes: Routes = [
  {path: '',component: FrontPageComponent},
	{path: 'stranka/:id',component: PageViewComponent},
	{path: 'seznam/ministerstva',component: EntityListComponent, data: {type:"ministerstvo"}},
	{path: 'seznam/obce',component: EntityListComponent, data: {type:"obec"}},
	
	{path: 'ico/:ico/admin/:view',component: EntityAdminComponent},
	{path: 'ico/:ico/admin', redirectTo: 'ico/:ico/admin/informace'},
	
	{path: 'ico/:ico/:view',component: EntityProfileComponent},
	{path: 'ico/:ico', redirectTo: 'ico/:ico/dashboard'}
];

export const routing = RouterModule.forRoot(appRoutes);