import { Routes, RouterModule } from '@angular/router';

import { DemoViewComponent } from './views/demo-view/demo-view.component';
import { DemoHomeComponent } from './views/demo-home/demo-home.component';

const appRoutes: Routes = [
	{path: '', component: DemoHomeComponent},
	
	{path: 'profil/:module', component: DemoViewComponent},
	{path: 'profil', redirectTo: 'profil/nastaveni', pathMatch: 'full'},
];

export const routing = RouterModule.forRoot(appRoutes);